/**
 * A token bucket that refills tokens over time.
 *
 * This implementation refills tokens at a fixed interval specified by `refillIntervalSeconds`.
 * Each bucket is associated with a key of type `_Key` and is used to rate-limit actions.
 *
 * @template _Key - The type of key used to identify buckets.
 */
export class RefillingTokenBucket<_Key> {
  public max: number;
  public refillIntervalSeconds: number;

  /**
   * Constructs a new RefillingTokenBucket.
   *
   * @param {number} max - The maximum number of tokens available in the bucket.
   * @param {number} refillIntervalSeconds - The interval (in seconds) at which tokens are refilled.
   */
  constructor(max: number, refillIntervalSeconds: number) {
    this.max = max;
    this.refillIntervalSeconds = refillIntervalSeconds;
  }

  private storage = new Map<_Key, RefillBucket>();

  /**
   * Checks if there are sufficient tokens available for the given key without consuming them.
   *
   * The function calculates how many tokens have been refilled since the bucket was last updated,
   * then determines if the total available tokens are at least equal to the specified cost.
   *
   * @param {_Key} key - The key identifying the token bucket.
   * @param {number} cost - The number of tokens required.
   * @returns {boolean} True if sufficient tokens are available; otherwise, false.
   */
  public check(key: _Key, cost: number): boolean {
    const bucket = this.storage.get(key) ?? null;
    if (bucket === null) {
      return true;
    }
    const now = Date.now();
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000),
    );
    if (refill > 0) {
      return Math.min(bucket.count + refill, this.max) >= cost;
    }
    return bucket.count >= cost;
  }

  /**
   * Consumes tokens from the bucket for the given key.
   *
   * If the bucket does not exist, it is created with tokens equal to `max` minus the cost.
   * If the bucket exists, it is refilled based on the elapsed time, and if there are enough tokens,
   * the specified cost is subtracted.
   *
   * @param {_Key} key - The key identifying the token bucket.
   * @param {number} cost - The number of tokens to consume.
   * @returns {boolean} True if tokens were successfully consumed; otherwise, false.
   */
  public consume(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        refilledAt: now,
      };
      this.storage.set(key, bucket);
      return true;
    }
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000),
    );
    bucket.count = Math.min(bucket.count + refill, this.max);
    bucket.refilledAt = now;
    if (bucket.count < cost) {
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }
}

/**
 * A throttler that controls the frequency of actions.
 *
 * The throttler uses a configurable timeout sequence defined by `timeoutSeconds` to determine when
 * an action is allowed for a specific key. The delay increases with each consecutive action.
 *
 * @template _Key - The type of key used to identify throttling counters.
 */
export class Throttler<_Key> {
  public timeoutSeconds: number[];

  private storage = new Map<_Key, ThrottlingCounter>();

  /**
   * Constructs a new Throttler.
   *
   * @param {number[]} timeoutSeconds - An array of timeout durations (in seconds) defining the delay for consecutive actions.
   */
  constructor(timeoutSeconds: number[]) {
    this.timeoutSeconds = timeoutSeconds;
  }

  /**
   * Attempts to perform an action for the given key, subject to throttling.
   *
   * This method checks if sufficient time has elapsed since the last action based on the current timeout.
   * If allowed, it updates the counter and increases the timeout level.
   *
   * @param {_Key} key - The key identifying the throttling counter.
   * @returns {boolean} True if the action is allowed; otherwise, false.
   */
  public consume(key: _Key): boolean {
    let counter = this.storage.get(key) ?? null;
    const now = Date.now();
    if (counter === null) {
      counter = {
        timeout: 0,
        updatedAt: now,
      };
      this.storage.set(key, counter);
      return true;
    }
    const allowed =
      now - counter.updatedAt >= this.timeoutSeconds[counter.timeout] * 1000;
    if (!allowed) {
      return false;
    }
    counter.updatedAt = now;
    counter.timeout = Math.min(
      counter.timeout + 1,
      this.timeoutSeconds.length - 1,
    );
    this.storage.set(key, counter);
    return true;
  }

  /**
   * Resets the throttling counter for the specified key.
   *
   * This method removes the counter associated with the key, resetting its throttling state.
   *
   * @param {_Key} key - The key identifying the throttling counter to reset.
   * @returns {void}
   */
  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

/**
 * A token bucket with an expiration mechanism.
 *
 * Tokens in this bucket expire after a fixed duration specified by `expiresInSeconds`.
 * This can be used for rate limiting where tokens should be reset after a certain time.
 *
 * @template _Key - The type of key used to identify buckets.
 */
export class ExpiringTokenBucket<_Key> {
  public max: number;
  public expiresInSeconds: number;

  private storage = new Map<_Key, ExpiringBucket>();

  /**
   * Constructs a new ExpiringTokenBucket.
   *
   * @param {number} max - The maximum number of tokens available in the bucket.
   * @param {number} expiresInSeconds - The duration (in seconds) after which the bucket tokens expire.
   */
  constructor(max: number, expiresInSeconds: number) {
    this.max = max;
    this.expiresInSeconds = expiresInSeconds;
  }

  /**
   * Checks if there are sufficient tokens available for the given key without consuming them.
   *
   * If the bucket for the key does not exist or has expired, the check returns true.
   * Otherwise, it verifies if the available tokens are at least equal to the specified cost.
   *
   * @param {_Key} key - The key identifying the token bucket.
   * @param {number} cost - The number of tokens required.
   * @returns {boolean} True if tokens are sufficient or bucket expired; otherwise, false.
   */
  public check(key: _Key, cost: number): boolean {
    const bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      return true;
    }
    if (now - bucket.createdAt >= this.expiresInSeconds * 1000) {
      return true;
    }
    return bucket.count >= cost;
  }

  /**
   * Consumes tokens from the bucket for the given key.
   *
   * If the bucket does not exist or has expired, a new bucket is created with tokens reset to the maximum,
   * and then the cost is subtracted. If the bucket exists, tokens are deducted if available.
   *
   * @param {_Key} key - The key identifying the token bucket.
   * @param {number} cost - The number of tokens to consume.
   * @returns {boolean} True if tokens were successfully consumed; otherwise, false.
   */
  public consume(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        createdAt: now,
      };
      this.storage.set(key, bucket);
      return true;
    }
    if (now - bucket.createdAt >= this.expiresInSeconds * 1000) {
      bucket.count = this.max;
    }
    if (bucket.count < cost) {
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }

  /**
   * Resets the token bucket for the specified key.
   *
   * This method deletes the bucket associated with the key.
   *
   * @param {_Key} key - The key identifying the token bucket to reset.
   * @returns {void}
   */
  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

/**
 * Interface representing a refillable token bucket.
 *
 * @interface RefillBucket
 * @property {number} count - The current number of tokens available.
 * @property {number} refilledAt - The timestamp (in milliseconds) when the bucket was last refilled.
 */
interface RefillBucket {
  count: number;
  refilledAt: number;
}

/**
 * Interface representing an expiring token bucket.
 *
 * @interface ExpiringBucket
 * @property {number} count - The current number of tokens available.
 * @property {number} createdAt - The timestamp (in milliseconds) when the bucket was created.
 */
interface ExpiringBucket {
  count: number;
  createdAt: number;
}

/**
 * Interface representing a throttling counter.
 *
 * @interface ThrottlingCounter
 * @property {number} timeout - The current timeout level (index into the timeoutSeconds array).
 * @property {number} updatedAt - The timestamp (in milliseconds) when the counter was last updated.
 */
interface ThrottlingCounter {
  timeout: number;
  updatedAt: number;
}

import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  sendVerificationEmailBucket,
  setEmailVerificationRequestCookie,
} from "$lib/server/auth/email-verification";
import { fail, redirect } from "@sveltejs/kit";
import {
  checkEmailAvailability,
  verifyEmailInput,
} from "$lib/server/auth/email";
import {
  verifyPasswordHash,
  verifyPasswordStrength,
} from "$lib/server/auth/password";
import {
  getUserPasswordHash,
  getUserRecoverCode,
  updateUserPassword,
} from "$lib/server/auth/user";
import type { SessionFlags } from "$lib/server/auth/session";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "$lib/server/auth/session";
import { ExpiringTokenBucket } from "$lib/server/auth/rate-limit";

import type { Actions, RequestEvent } from "./$types";

const passwordUpdateBucket = new ExpiringTokenBucket<string>(5, 60 * 30);

export async function load(event: RequestEvent) {
  if (event.locals.session === null || event.locals.user === null) {
    return redirect(302, "/login");
  }
  if (
    event.locals.user.registered2FA &&
    !event.locals.session.twoFactorVerified
  ) {
    return redirect(302, "/2fa");
  }
  let recoveryCode: string | null = null;
  if (event.locals.user.registered2FA) {
    recoveryCode = await getUserRecoverCode(event.locals.user.id);
  }
  return {
    recoveryCode,
    user: event.locals.user,
  };
}

export const actions: Actions = {
  password: updatePasswordAction,
  email: updateEmailAction,
  logout: logout,
};

async function updatePasswordAction(event: RequestEvent) {
  if (event.locals.session === null || event.locals.user === null) {
    return fail(401, {
      password: {
        message: "Not authenticated",
      },
    });
  }
  if (
    event.locals.user.registered2FA &&
    !event.locals.session.twoFactorVerified
  ) {
    return fail(403, {
      password: {
        message: "Forbidden",
      },
    });
  }
  if (!passwordUpdateBucket.check(event.locals.session.id, 1)) {
    return fail(429, {
      password: {
        message: "Too many requests",
      },
    });
  }

  const formData = await event.request.formData();
  const password = formData.get("password");
  const newPassword = formData.get("new_password");
  if (typeof password !== "string" || typeof newPassword !== "string") {
    return fail(400, {
      password: {
        message: "Invalid or missing fields",
      },
    });
  }
  const strongPassword = await verifyPasswordStrength(newPassword);
  if (!strongPassword) {
    return fail(400, {
      password: {
        message: "Weak password",
      },
    });
  }

  if (!passwordUpdateBucket.consume(event.locals.session.id, 1)) {
    return fail(429, {
      password: {
        message: "Too many requests",
      },
    });
  }

  const passwordHash = await getUserPasswordHash(event.locals.user.id);
  const validPassword = await verifyPasswordHash(passwordHash, password);
  if (!validPassword) {
    return fail(400, {
      password: {
        message: "Incorrect password",
      },
    });
  }
  passwordUpdateBucket.reset(event.locals.session.id);
  await invalidateUserSessions(event.locals.user.id);
  await updateUserPassword(event.locals.user.id, newPassword);

  const sessionToken = generateSessionToken();
  const sessionFlags: SessionFlags = {
    twoFactorVerified: event.locals.session.twoFactorVerified,
  };
  const session = await createSession(
    sessionToken,
    event.locals.user.id,
    sessionFlags,
  );
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return {
    password: {
      message: "Updated password",
    },
  };
}

async function updateEmailAction(event: RequestEvent) {
  if (event.locals.session === null || event.locals.user === null) {
    return fail(401, {
      email: {
        message: "Not authenticated",
      },
    });
  }
  if (
    event.locals.user.registered2FA &&
    !event.locals.session.twoFactorVerified
  ) {
    return fail(403, {
      email: {
        message: "Forbidden",
      },
    });
  }
  if (!sendVerificationEmailBucket.check(event.locals.user.id, 1)) {
    return fail(429, {
      email: {
        message: "Too many requests",
      },
    });
  }

  const formData = await event.request.formData();
  const email = formData.get("email");
  if (typeof email !== "string") {
    return fail(400, {
      email: {
        message: "Invalid or missing fields",
      },
    });
  }
  if (email === "") {
    return fail(400, {
      email: {
        message: "Please enter your email",
      },
    });
  }
  if (!verifyEmailInput(email)) {
    return fail(400, {
      email: {
        message: "Please enter a valid email",
      },
    });
  }
  const emailAvailable = await checkEmailAvailability(email);
  if (!emailAvailable) {
    return fail(400, {
      email: {
        message: "This email is already used",
      },
    });
  }
  if (!sendVerificationEmailBucket.consume(event.locals.user.id, 1)) {
    return fail(429, {
      email: {
        message: "Too many requests",
      },
    });
  }
  const verificationRequest = await createEmailVerificationRequest(
    event.locals.user.id,
    email,
  );
  sendVerificationEmail(verificationRequest.email, verificationRequest.code);
  setEmailVerificationRequestCookie(event, verificationRequest);
  return redirect(302, "/verify-email");
}

async function logout(event: RequestEvent) {
  if (event.locals.session === null) {
    return fail(401, {
      message: "Not authenticated",
    });
  }
  await invalidateSession(event.locals.session.id);
  deleteSessionTokenCookie(event);
  return redirect(302, "/login");
}

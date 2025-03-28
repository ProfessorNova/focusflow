<script lang="ts">
    import {enhance} from "$app/forms";
    import {navSection} from "$lib/store/navSectionStore";
    import type {ActionData, PageData} from "./$types";
    import NavSectionDisplay from "$lib/components/NavSectionDisplay.svelte";
    import Navbar from "$lib/components/NavBar.svelte";

    export let data: PageData;
    export let form: ActionData;

    // Set the current navbar section to "Settings"
    navSection.set("Settings");

    let recoveryVisible = false;

    /**
     * Toggles the recovery code visibility.
     */
    function toggleRecoveryCodeVisibility() {
        recoveryVisible = !recoveryVisible;
    }
</script>

<Navbar/>
<NavSectionDisplay/>

<main class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold mb-6">Settings</h1>

    <!-- Update Email Section -->
    <section class="mb-6">
        <div class="card bg-base-100 shadow-lg shadow-neutral">
            <div class="card-body">
                <h2 class="card-title">Update email</h2>
                <p class="text-sm text-gray-600">Your email: {data.user.email}</p>
                <form method="post" use:enhance action="?/email">
                    <div class="form-control">
                        <label class="label" for="form-email">
                            <span class="label-text">New email</span>
                        </label>
                        <input
                                type="email"
                                id="form-email"
                                name="email"
                                required
                                class="input input-bordered"
                        />
                    </div>
                    <div class="mt-4">
                        <button class="btn btn-primary">Update</button>
                    </div>
                    <p class="text-error mt-2">{form?.email?.message ?? ""}</p>
                </form>
            </div>
        </div>
    </section>

    <!-- Update Password Section -->
    <section class="mb-6">
        <div class="card bg-base-100 shadow-lg shadow-neutral">
            <div class="card-body">
                <h2 class="card-title">Update password</h2>
                <form method="post" use:enhance action="?/password">
                    <!-- Current password -->
                    <div class="form-control">
                        <label class="label" for="form-password-current">
                            <span class="label-text">Current password</span>
                        </label>
                        <input
                                type="password"
                                id="form-password-current"
                                name="password"
                                autocomplete="current-password"
                                required
                                class="input input-bordered"
                        />
                    </div>

                    <!-- New password -->
                    <div class="form-control mt-4">
                        <label class="label" for="form-password-new">
                            <span class="label-text">New password</span>
                        </label>
                        <input
                                type="password"
                                id="form-password-new"
                                name="new_password"
                                autocomplete="new-password"
                                required
                                class="input input-bordered"
                        />
                    </div>

                    <div class="mt-4">
                        <button class="btn btn-primary">Update</button>
                    </div>
                    <p class="text-error mt-2">{form?.password?.message ?? ""}</p>
                </form>
            </div>
        </div>
    </section>

    <!-- Two-Factor Authentication Section -->
    {#if data.user.registered2FA}
        <section class="mb-6">
            <div class="card bg-base-100 shadow-lg shadow-neutral">
                <div class="card-body">
                    <h2 class="card-title">Update two-factor authentication</h2>
                    <a href="/2fa/setup" class="btn btn-secondary">Update</a>
                </div>
            </div>
        </section>
    {/if}

    <!-- Recovery Code Section -->
    {#if data.recoveryCode !== null}
        <section class="mb-6">
            <div class="card bg-base-100 shadow-lg shadow-neutral">
                <div class="card-body">
                    <h2 class="card-title">Recovery code</h2>
                    <div class="form-control">
                        <label class="label" for="recoveryCodeField">
                            <span class="label-text">Your recovery code</span>
                        </label>
                        <div class="relative">
                            <input
                                    type={recoveryVisible ? "text" : "password"}
                                    id="recoveryCodeField"
                                    value={data.recoveryCode}
                                    readonly
                                    class="input input-bordered w-full pr-10"
                            />
                            <button
                                    type="button"
                                    class="absolute top-1/2 right-2 transform -translate-y-1/2"
                                    aria-label="Toggle recovery code visibility"
                                    on:click={toggleRecoveryCodeVisibility}
                            >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                >
                                    <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477
                                           0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542
                                           7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {/if}
</main>

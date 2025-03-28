<script lang="ts">
	import {enhance} from "$app/forms";

	import type {ActionData} from "./$types";
	import {ArrowBigLeft} from "lucide-svelte";

	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
    <div>
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 pt-2 rounded-box">
            <legend class="fieldset-legend">Create an account</legend>

            <form class="fieldset w-xs p-4" method="post" use:enhance>
                <p class="text-info mb-2">Your username must be at least 3 characters long and your password must be at
                    least 8 characters long.</p>

                <label class="fieldset-label" for="form-signup.username">Username</label>
                <input class="input" placeholder="Username" id="form-signup.username" name="username"
                       value={form?.username ?? ""} minlength="4" maxlength="31" required/>

                <label class="fieldset-label" for="form-signup.email">Email</label>
                <input class="input" placeholder="Email" type="email" id="form-signup.email" name="email"
                       autocomplete="username" value={form?.email ?? ""} required/>

                <label class="fieldset-label" for="form-signup.password">Password</label>
                <input class="input" placeholder="Password" type="password" id="form-signup.password" name="password"
                       autocomplete="new-password" required/>

                {#if form?.message == null}
                    <p class="text-error mt-1 invisible">{"Error message"}</p>
                {:else}
                    <p class="text-error mt-1">{form?.message ?? ""}</p>
                {/if}

                <button class="btn btn-neutral mt-2">Sign up</button>
            </form>
        </fieldset>
        <div class="flex items-center">
            <ArrowBigLeft/>
            <a href="/login" class="link-hover">Sign in</a>
        </div>
    </div>
</div>
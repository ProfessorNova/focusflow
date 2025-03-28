<script lang="ts">
	import {enhance} from "$app/forms";

	import type {ActionData} from "./$types";
	import {ArrowBigLeft} from "lucide-svelte";

	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
    <div>
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 pt-2 rounded-box">
            <legend class="fieldset-legend">Forgot your password?</legend>

            <form class="fieldset w-xs p-4" method="post" use:enhance>
                <label class="fieldset-label" for="form-forgot.email">Email</label>
                <input class="input" placeholder="Email" type="email" id="form-forgot.email" name="email"
                       autocomplete="username" value={form?.email ?? ""} required/>

                {#if form?.message == null}
                    <p class="text-error mt-1 invisible">{"Error message"}</p>
                {:else}
                    <p class="text-error mt-1">{form?.message ?? ""}</p>
                {/if}

                <button class="btn btn-neutral mt-2">Send</button>
            </form>
        </fieldset>
        <div class="flex items-center">
            <ArrowBigLeft/>
            <a href="/login" class="link-hover">Sign in</a>
        </div>
    </div>
</div>
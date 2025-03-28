<script lang="ts">
    import {enhance} from "$app/forms";

    import type {ActionData} from "./$types";
    import {ArrowBigLeft} from "lucide-svelte";

    export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
    <div>
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend class="fieldset-legend">Two-factor authentication</legend>

            <form class="fieldset w-xs p-4 pb-0" method="post" use:enhance>

                <label class="fieldset-label" for="form-totp.code">Enter the code from your authenticator app</label>
                <input class="input" id="form-totp.code" name="code" required/>

                {#if form?.message == null}
                    <p class="text-error mt-1 invisible">{"Error message"}</p>
                {:else}
                    <p class="text-error mt-1">{form?.message ?? ""}</p>
                {/if}

                <button class="btn btn-neutral mt-2">Verify</button>
            </form>
        </fieldset>
        <div class="flex items-center">
            <ArrowBigLeft/>
            <a href="/2fa/reset" class="link-hover">Use recovery code</a>
        </div>
    </div>
</div>
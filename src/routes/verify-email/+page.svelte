<script lang="ts">
	import {enhance} from "$app/forms";

	import type {ActionData, PageData} from "./$types";
	import {ArrowBigLeft} from "lucide-svelte";

	export let data: PageData;
    export let form: ActionData;
</script>


<div class="flex h-screen place-content-center items-center">
    <div>
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend class="fieldset-legend">Verify your email address</legend>

            <form class="fieldset w-xs p-4 pb-0" method="post" use:enhance action="?/verify">
                <div>
                    <span class="text-info mb-2">We sent an 8-digit code to</span>
                    <span class="mb-2">{data.email}</span>
                </div>

                <label class="fieldset-label" for="form-verify.code">Code</label>
                <input class="input" placeholder="Code" id="form-verify.code" name="code" required/>

                {#if form?.verify?.message == null}
                    <p class="text-error mt-1 invisible">{"Error message"}</p>
                {:else}
                    <p class="text-error mt-1">{form?.verify?.message ?? ""}</p>
                {/if}

                <button class="btn btn-neutral mt-2">Verify</button>
            </form>

            <form class="fieldset w-xs p-4 pt-0" method="post" use:enhance action="?/resend">
                {#if form?.resend?.message == null}
                    <p class="text-error mt-2 invisible">{"Error message"}</p>
                {:else}
                    <p class="text-success mt-2">{form?.resend?.message ?? ""}</p>
                {/if}
                <button class="btn btn-neutral mt-1">Resend code</button>
            </form>

        </fieldset>
        <div class="flex items-center">
            <ArrowBigLeft/>
            <a href="/settings" class="link-hover">Change your email</a>
        </div>
    </div>
</div>
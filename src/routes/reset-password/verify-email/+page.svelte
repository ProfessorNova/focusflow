<script lang="ts">
	import { enhance } from "$app/forms";
    import { ArrowBigLeft } from "lucide-svelte";

	import type { ActionData, PageData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
	<div>
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Verify your email address</legend>
		  
			<form class="fieldset w-xs p-4" method="post" use:enhance>
				<div>
                    <span class="text-info mb-2">We sent an 8-digit code to</span>
                    <span class="mb-2">{data.email}</span>
                </div>

				<label for="form-verify.code" class="fieldset-label">Code</label>
				<input class="input" placeholder="Code" type="text" id="form-verify.code" name="code" required/>
				
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
			<a href="/forgot-password" class="link-hover">Change Email</a>
		</div>
	</div>
</div>

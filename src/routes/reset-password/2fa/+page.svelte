<script lang="ts">
	import { enhance } from "$app/forms";
    import { ArrowBigLeft } from "lucide-svelte";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
	<div>
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Two-factor authentication</legend>
		  
			<form class="fieldset w-xs p-4" method="post" use:enhance action="?/totp">
				<p class="text-info mb-2">Enter the code from your authenticator app.</p>

				<label for="form-verify.code" class="fieldset-label">Code</label>
				<input class="input" placeholder="Code" type="text" id="form-verify.code" name="code" required/>
				
				{#if form?.totp?.message == null}
					<p class="text-error mt-1 invisible">{"Error message"}</p>
				{:else}
					<p class="text-error mt-1">{form?.totp?.message ?? ""}</p>
				{/if}
		
				<button class="btn btn-neutral mt-2">Verify</button>
			</form>
			<div class="divider">OR</div>
			<form class="fieldset w-xs p-4" method="post" use:enhance action="?/recovery_code">
				<p class="text-info mb-2">Use your recovery code instead</p>

				<label for="form-recovery-code.code" class="fieldset-label">Recovery code</label>
				<input class="input" placeholder="Recovery code" type="code" id="form-recovery-code.code" name="code" required/>
				
				{#if form?.recoveryCode?.message == null}
					<p class="text-error mt-1 invisible">{"Error message"}</p>
				{:else}
					<p class="text-error mt-1">{form?.recoveryCode?.message ?? ""}</p>
				{/if}
		
				<button class="btn btn-neutral mt-2">Verify</button>
			</form>

		</fieldset>
		<div class="flex items-center">
			<ArrowBigLeft/>
			<a href="/login" class="link-hover">Cancel</a>
		</div>
	</div>
</div>

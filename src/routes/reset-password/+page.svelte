<script lang="ts">
	import { enhance } from "$app/forms";
    import { ArrowBigLeft } from "lucide-svelte";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
	<div>
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Enter your new password</legend>
		  
			<form class="fieldset w-xs p-4" method="post" use:enhance>
				<label class="fieldset-label" for="form-reset.password">Password</label>
				<input class="input" type="password" id="form-reset.password" name="password" placeholder="New password" autocomplete="new-password" required />
				
				{#if form?.message == null}
					<p class="text-error mt-1 invisible">{"Error message"}</p>
				{:else}
					<p class="text-error mt-1">{form?.message ?? ""}</p>
				{/if}
		
				<button class="btn btn-neutral mt-2">Reset password</button>
			</form>
		</fieldset>
		<div class="flex items-center">
			<ArrowBigLeft/>
			<a href="/login" class="link-hover">Cancel</a>
		</div>
	</div>
</div>

<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData, PageData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>


<div class="flex h-screen place-content-center items-center">
	<div>
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Set up two-factor authentication</legend>
		  
			<div style="width:200px; height: 200px;" class="flex justify-self-center">
				{@html data.qrcode}
			</div>

			<form class="fieldset w-xs p-4 pb-0" method="post" use:enhance>
				<input name="key" value={data.encodedTOTPKey} hidden required />
				<label class="fieldset-label" for="form-totp.code">Verify the code from the app</label>
				<input class="input" id="form-totp.code" name="code" required />
				
				{#if form?.message == null}
					<p class="text-error mt-1 invisible">{"Error message"}</p>
				{:else}
					<p class="text-error mt-1">{form?.message ?? ""}</p>
				{/if}
		
				<button class="btn btn-neutral mt-2">Verify</button>
			</form>
		</fieldset>
	</div>
</div>
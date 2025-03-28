<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="flex h-screen place-content-center items-center">
	<div>
		<fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
			<legend class="fieldset-legend">Sign in</legend>
		  
			<form class="fieldset w-xs p-4" method="post" use:enhance>
				<label for="form-login.email" class="fieldset-label">Email</label>
				<input class="input" placeholder="Email" type="email" id="form-login.email" name="email" autocomplete="username" value={form?.email ?? ""} required/>
		
				<label for="form-login.password" class="fieldset-label">Password</label>
				<input class="input" placeholder="Password" type="password" id="form-login.password" name="password" autocomplete="current-password" required />
				
				{#if form?.message == null}
					<p class="text-error mt-1 invisible">{"Error message"}</p>
				{:else}
					<p class="text-error mt-1">{form?.message ?? ""}</p>
				{/if}
		
				<button class="btn btn-neutral mt-2">Login</button>
		
				<div class="flex justify-between mt-2">
					<a class="p-1 link-hover" href="/signup">Create an account</a>
					<a class="p-1 link-hover" href="/forgot-password">Forgot password?</a>
				</div>
			</form>
		</fieldset>
	</div>
</div>
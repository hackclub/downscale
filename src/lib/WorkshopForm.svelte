<script lang="ts">
	const filloutUrl = `https://forms.fillout.com/t/pqVhenw3wEus`;
</script>

<svelte:head>
	<script src="https://server.fillout.com/embed/v1/" async></script>
</svelte:head>

<button
	type="button"
	data-fillout-id="pqVhenw3wEus"
	data-fillout-embed-type="popup"
	data-fillout-inherit-parameters
	data-fillout-popup-size="large"
	class="workshop-form-button group mt-8 block w-full max-w-xl cursor-pointer border-[5px] border-p-white px-[15px] pt-[10px] pb-[6px] text-left hover:bg-p-navy active:translate-y-[5px]"
>
	<span class="text-p8 text-p-white">
		<span class="text-p8 w-max bg-[linear-gradient(to_bottom,var(--color-p-white)_36%,var(--color-p-lightgray)_36%)] bg-clip-text text-transparent group-hover:bg-[linear-gradient(to_bottom,var(--color-p-red-1)_36%,var(--color-p-red-2)_36%)]">
			I WANT TO RUN ONE
		</span>
	</span>
</button>

<style>
	.workshop-form-button {
		position: relative;
	}

	.workshop-form-button::after {
		content: "";
		position: absolute;
		right: -5px;
		bottom: -15px;
		left: -5px;
		height: 5px;
		background: var(--color-p-gray);
	}

	.workshop-form-button::before {
		content: "";
		position: absolute;
		right: -5px;
		bottom: -10px;
		left: -5px;
		height: 5px;
		background: var(--color-p-navy);
	}

	.workshop-form-button:active::before,
	.workshop-form-button:active::after {
		display: none;
	}
</style>

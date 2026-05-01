<script lang="ts">
	interface Props {
		active: boolean;
		onToggle: () => void;
		compact?: boolean;
	}
	let { active, onToggle, compact = false }: Props = $props();
</script>

<button
	type="button"
	class="acc-switch"
	class:on={active}
	class:compact
	onclick={onToggle}
	role="switch"
	aria-checked={active}
	aria-label="Toggle accessible font"
	title={active ? 'Switch to default pixel font' : 'Switch to accessible font'}
>
	<span class="acc-label">accessible font</span>
	<span class="acc-track" aria-hidden="true">
		<span class="acc-fill"></span>
		<span class="acc-knob">
			<span class="acc-knob-pip"></span>
		</span>
	</span>
</button>

<style>
	.acc-switch {
		--px: 3px;
		display: inline-flex;
		align-items: center;
		gap: calc(var(--px) * 3);
		background: var(--color-p-navy);
		border: var(--px) solid var(--color-p-navy-light);
		padding: calc(var(--px) * 2) calc(var(--px) * 3);
		cursor: pointer;
		font-family: var(--font-pico);
		color: var(--color-p-gray);
		transition: border-color 0.1s steps(2), color 0.1s steps(2);
		flex-shrink: 0;
		appearance: none;
		-webkit-tap-highlight-color: transparent;
	}

	.acc-switch:hover {
		border-color: var(--color-p-gray);
		color: var(--color-p-lightgray);
	}

	.acc-switch.on {
		border-color: var(--color-p-red-2);
		color: var(--color-p-red-1);
	}

	.acc-switch.on:hover {
		border-color: var(--color-p-red-1);
	}

	.acc-switch:focus-visible {
		outline: var(--px) solid var(--color-p-red-1);
		outline-offset: var(--px);
	}

	.acc-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		line-height: 1;
		white-space: nowrap;
		max-width: 0;
		opacity: 0;
		overflow: hidden;
		margin-right: calc(var(--px) * -3);
		transition:
			max-width 0.08s steps(3),
			opacity 0.06s steps(2),
			margin-right 0.08s steps(3),
			color 0.1s steps(2);
	}

	.acc-switch:hover .acc-label,
	.acc-switch:focus-visible .acc-label {
		max-width: calc(var(--px) * 80);
		opacity: 1;
		margin-right: 0;
	}

	.acc-switch.compact .acc-label {
		display: none;
	}

	/* ── Track ── */

	.acc-track {
		position: relative;
		display: block;
		width: calc(var(--px) * 14);
		height: calc(var(--px) * 5);
		background: var(--color-p-navy-light);
		overflow: hidden;
		flex-shrink: 0;
	}

	.acc-fill {
		position: absolute;
		inset: 0;
		width: 0%;
		background: var(--color-p-red-2);
		transition: width 0.12s steps(4);
	}

	.acc-switch.on .acc-fill {
		width: 100%;
	}

	/* ── Knob ── */

	.acc-knob {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(var(--px) * 5);
		height: calc(var(--px) * 5);
		background: var(--color-p-gray);
		transition:
			transform 0.12s steps(4),
			background 0.12s steps(2);
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.acc-knob-pip {
		width: var(--px);
		height: var(--px);
		background: var(--color-p-navy);
		transition: background 0.12s steps(2);
	}

	.acc-switch:hover .acc-knob {
		background: var(--color-p-lightgray);
	}

	.acc-switch:hover .acc-knob-pip {
		background: var(--color-p-navy-light);
	}

	.acc-switch.on .acc-knob {
		transform: translateX(calc(var(--px) * 9));
		background: var(--color-p-white);
	}

	.acc-switch.on .acc-knob-pip {
		background: var(--color-p-red-1);
	}

	.acc-switch.on:hover .acc-knob {
		background: var(--color-p-white);
	}

	/* Pressed state — knob nudges in the direction it's about to travel */
	.acc-switch:active:not(.on) .acc-knob {
		transform: translateX(var(--px));
	}

	.acc-switch.on:active .acc-knob {
		transform: translateX(calc(var(--px) * 8));
	}

	@media (prefers-reduced-motion: reduce) {
		.acc-switch,
		.acc-fill,
		.acc-knob,
		.acc-knob-pip,
		.acc-label {
			transition-duration: 0s;
		}
	}
</style>

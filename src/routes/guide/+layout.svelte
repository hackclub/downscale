<script lang="ts">
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

	if (browser) {
		gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
	}

	let { children } = $props();

	let guideContainer: HTMLDivElement = undefined!;
	let sidebarList: HTMLOListElement = undefined!;
	let headings = $state<{ id: string; text: string }[]>([]);
	let activeIndex = $state(-1);
	let isMobile = $state(false);
	let menuOpen = $state(false);

	let progressPx = $state(0);

	// Compute progress track fill to match the active dot's position
	$effect(() => {
		if (!sidebarList || activeIndex < 0) return;
		const li = sidebarList.children[activeIndex] as HTMLElement | undefined;
		if (!li) return;
		const listTop = sidebarList.getBoundingClientRect().top;
		const liRect = li.getBoundingClientRect();
		progressPx = liRect.top + liRect.height / 2 - listTop;
	});

	function handleClick(e: MouseEvent, id: string) {
		e.preventDefault();
		const el = document.getElementById(id);
		if (el) {
			menuOpen = false;
			history.replaceState(null, '', `#${id}`);
			gsap.to(window, {
				scrollTo: { y: el, offsetY: 32 },
				duration: 0.8,
				ease: 'power2.inOut'
			});
		}
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	// Check mobile breakpoint
	$effect(() => {
		const mql = window.matchMedia('(max-width: 1023px)');
		isMobile = mql.matches;
		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
			if (!e.matches) menuOpen = false;
		};
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	// GSAP ScrollTrigger for each section
	$effect(() => {
		if (!browser) return;

		const h2s = Array.from(guideContainer.querySelectorAll('h2[id]'));
		headings = h2s.map((el) => ({
			id: el.id,
			text: el.textContent ?? ''
		}));

		if (h2s.length === 0) return;

		const triggers: ScrollTrigger[] = [];

		h2s.forEach((h2, i) => {
			const isLast = i === h2s.length - 1;
			const st = ScrollTrigger.create({
				trigger: h2,
				start: 'top 20%',
				endTrigger: isLast ? guideContainer : h2s[i + 1],
				end: isLast ? 'bottom bottom' : 'top 20%',
				onToggle: (self) => {
					if (self.isActive) {
						activeIndex = i;
					}
				}
			});
			triggers.push(st);
		});

		ScrollTrigger.refresh();

		return () => {
			triggers.forEach(t => t.kill());
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Mobile navbar (outside guide-page for sticky to work) -->
{#if isMobile}
	<div class="mobile-navbar">
		<button class="menu-btn" onclick={toggleMenu} aria-label="Toggle outline">
			<span class="menu-icon" class:open={menuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</span>
		</button>
		<span class="mobile-section-label">
			{activeIndex >= 0 && headings[activeIndex] ? headings[activeIndex].text : 'Build a Space Shooter'}
		</span>
	</div>

	{#if menuOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="menu-backdrop" onclick={() => menuOpen = false} onkeydown={() => {}}></div>
		<nav class="menu-drawer" aria-label="Guide sections">
			<ol class="drawer-list">
				{#each headings as heading, i}
					<li
						class:active={activeIndex === i}
						class:completed={activeIndex > -1 && i < activeIndex}
					>
						<a
							href="#{heading.id}"
							class:active={activeIndex === i}
							onclick={(e) => handleClick(e, heading.id)}
						>
							<span class="drawer-number">{String(i + 1).padStart(2, '0')}</span>
							<span>{heading.text}</span>
						</a>
					</li>
				{/each}
			</ol>
		</nav>
	{/if}
{/if}

<div class="guide-page">
	<div class="guide-layout">
		<!-- Desktop sidebar -->
		<nav class="guide-sidebar" aria-label="Guide sections">
			<div class="sidebar-inner">
				<ol class="sidebar-list" bind:this={sidebarList}>
					{#each headings as heading, i}
						<li
							class:active={activeIndex === i}
							class:completed={activeIndex > -1 && i < activeIndex}
						>
							<a
								href="#{heading.id}"
								class:active={activeIndex === i}
								onclick={(e) => handleClick(e, heading.id)}
								aria-current={activeIndex === i ? 'true' : undefined}
							>
								<span class="sidebar-number">{String(i + 1).padStart(2, '0')}</span>
								<span class="sidebar-label">{heading.text}</span>
							</a>
						</li>
					{/each}
				</ol>
				<div
					class="sidebar-track"
					style="--progress: {progressPx}px"
				></div>
			</div>
		</nav>
		<div class="guide-container" bind:this={guideContainer}>
			{@render children()}
		</div>
	</div>
</div>

<style>
	:global(html) {
		background-color: var(--color-p-navy) !important;
		scroll-padding-top: 2rem;
		scrollbar-color: var(--color-p-red-1) transparent;
		scrollbar-width: thin;
	}

	:global(html::-webkit-scrollbar) {
		width: 8px;
		background: transparent;
	}

	:global(html::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(html::-webkit-scrollbar-thumb) {
		background: var(--color-p-red-1);
		border-radius: 0;
	}

	:global(html::-webkit-scrollbar-button) {
		display: none;
	}

	.guide-page {
		--px: 3px;
		--guide-red-outline: #422136;
		background: var(--color-p-navy);
		min-height: 100vh;
		padding: 3rem 1.5rem 6rem;
		font-family: 'Jost', sans-serif;
		color: var(--color-p-lightgray);
	}

	:global(body) {
		overflow-x: hidden;
	}

	/* ── Grid layout ── */

	.guide-layout {
		display: grid;
		grid-template-columns: 220px minmax(0, 740px);
		gap: 0 2rem;
		max-width: calc(220px + 2rem + 740px);
		margin: 0 auto;
	}

	/* ── Desktop sidebar ── */

	.guide-sidebar {
		position: sticky;
		top: 3rem;
		align-self: start;
		max-height: calc(100vh - 6rem);
		overflow-y: auto;
	}

	.guide-sidebar::-webkit-scrollbar {
		width: var(--px);
	}
	.guide-sidebar::-webkit-scrollbar-track {
		background: var(--color-p-navy);
	}
	.guide-sidebar::-webkit-scrollbar-thumb {
		background: var(--color-p-navy-light);
	}

	.sidebar-inner {
		position: relative;
		padding-left: calc(var(--px) * 6);
	}

	/* Progress track */
	.sidebar-track {
		position: absolute;
		left: calc(var(--px) * 1);
		top: 0;
		bottom: 0;
		width: var(--px);
		background: linear-gradient(
			to bottom,
			var(--color-p-red-2) var(--progress),
			var(--color-p-navy-light) var(--progress)
		);
	}

	/* Sidebar list */
	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sidebar-list li {
		position: relative;
	}

	/* Notch squares */
	.sidebar-list li::before {
		content: '';
		position: absolute;
		left: calc(var(--px) * -5);
		top: 50%;
		transform: translateY(-50%);
		width: calc(var(--px) * 2);
		height: calc(var(--px) * 2);
		background: var(--color-p-navy-light);
	}

	.sidebar-list li.completed::before {
		background: var(--color-p-red-2);
	}

	.sidebar-list li.active::before {
		background: var(--color-p-red-1);
	}

	/* Links */
	.sidebar-list a {
		display: flex;
		gap: calc(var(--px) * 2);
		padding: calc(var(--px) * 2) 0;
		font-family: var(--font-pico);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-p-gray);
		text-decoration: none;
		line-height: 1.4;
	}

	.sidebar-list a:hover {
		color: var(--color-p-white);
		text-decoration: none;
	}

	.sidebar-list li.completed > a {
		color: var(--color-p-lightgray);
	}

	.sidebar-list li.completed > a:hover {
		color: var(--color-p-white);
	}

	.sidebar-list a.active {
		color: var(--color-p-red-1);
	}

	.sidebar-number {
		flex-shrink: 0;
		opacity: 0.5;
	}

	.sidebar-list a.active .sidebar-number {
		opacity: 1;
	}

	/* ── Mobile navbar + drawer ── */

	.mobile-navbar {
		--px: 3px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--color-p-navy);
		border-bottom: var(--px) solid var(--color-p-navy-light);
		padding: 0.5rem 1rem;
	}

	.menu-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: calc(var(--px) * 2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-icon {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 18px;
	}

	.menu-icon span {
		display: block;
		height: var(--px);
		background: var(--color-p-lightgray);
		width: 100%;
	}

	.menu-icon.open span:nth-child(1) {
		transform: translateY(calc(var(--px) + 4px)) rotate(45deg);
	}
	.menu-icon.open span:nth-child(2) {
		opacity: 0;
	}
	.menu-icon.open span:nth-child(3) {
		transform: translateY(calc(-1 * (var(--px) + 4px))) rotate(-45deg);
	}

	.mobile-section-label {
		font-family: var(--font-pico);
		font-size: 0.7rem;
		color: var(--color-p-gray);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.menu-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 25;
		animation: fade-in 0.1s ease-out;
	}

	.menu-drawer {
		--px: 3px;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(300px, 80vw);
		background: var(--color-p-navy);
		border-right: var(--px) solid var(--color-p-navy-light);
		z-index: 30;
		overflow-y: auto;
		padding: 1.5rem;
		animation: slide-in 0.15s ease-out;
	}

	@keyframes slide-in {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.drawer-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.drawer-list li {
		border-bottom: var(--px) solid var(--color-p-navy-light);
	}

	.drawer-list a {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 0;
		font-family: var(--font-pico);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-p-gray);
		text-decoration: none;
		line-height: 1.4;
	}

	.drawer-list a:hover {
		color: var(--color-p-white);
	}

	.drawer-list li.completed > a {
		color: var(--color-p-lightgray);
	}

	.drawer-list li.completed > a:hover {
		color: var(--color-p-white);
	}

	.drawer-list a.active {
		color: var(--color-p-red-1);
	}

	.drawer-number {
		flex-shrink: 0;
		opacity: 0.5;
	}

	.drawer-list a.active .drawer-number {
		opacity: 1;
	}

	/* ── Responsive ── */

	@media (max-width: 1023px) {
		.guide-page {
			padding-top: 3rem;
		}

		.guide-layout {
			grid-template-columns: 1fr;
			max-width: 740px;
		}

		.guide-sidebar {
			display: none;
		}
	}

	@media (min-width: 1024px) {
		.mobile-navbar,
		.menu-backdrop,
		.menu-drawer {
			display: none;
		}
	}

	/* ── Guide content ── */

	.guide-container {
		max-width: 740px;
		min-width: 0;
	}

	/*
	   Elevation model (dark mode):
	     Base page:   #111d35  (--color-p-navy)
	     Elevated:    #1d2b53  (--color-p-navy-light)
	     Code inset:  #111d35  (same as page, appears inset inside elevated cards)

	   Border philosophy:
	     3px = proportional to body text size (pixel-art "1px" at this scale)
	     Structural borders: --color-p-navy-light or --color-p-gray
	     Red reserved for meaningful accents only

	   Two-color split gradient (from main page):
	     Headers use background-clip: text with a hard color split
	     PICO-8 font: 36% split, Absolute font: 55.75% split
	*/

	/* ── Headers ── */

	.guide-container :global(h1) {
		display: block;
		border-bottom: 3px solid var(--color-p-navy-light);
		padding-bottom: 1.5rem;
		margin-top: 2.5rem;
		margin-bottom: 1.25rem;
		overflow: visible;
	}

	.guide-container :global(.guide-title) {
		font-family: var(--font-title);
		font-size: var(--text-p8-title);
		line-height: var(--leading-p8-title);
		background-image: linear-gradient(to bottom, var(--color-p-red-1) 55.75%, var(--color-p-red-2) 55.75%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		text-transform: lowercase;
		letter-spacing: 1px;
	}

	.guide-container :global(.guide-title-white) {
		background-image: linear-gradient(to bottom, var(--color-p-white) 55.75%, var(--color-p-lightgray) 55.75%);
	}

	.guide-container :global(h2) {
		font-family: var(--font-pico);
		font-size: 1.2rem;
		background: linear-gradient(to bottom, var(--color-p-red-1) 36%, var(--color-p-red-2) 36%);
		background-origin: content-box;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		border-bottom: 3px solid var(--color-p-navy-light);
		padding-bottom: 0.4rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.guide-container :global(h3) {
		font-family: var(--font-pico);
		font-size: 1.2rem;
		background: linear-gradient(to bottom, var(--color-p-white) 36%, var(--color-p-lightgray) 36%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* ── Body text ── */

	.guide-container :global(p),
	.guide-container :global(ul),
	.guide-container :global(ol) {
		font-size: 18px;
		line-height: 160%;
		margin: 1rem 0;
		color: var(--color-p-lightgray);
	}

	.guide-container :global(ul),
	.guide-container :global(ol) {
		padding-left: 1.5rem;
	}

	.guide-container :global(ul) {
		list-style: none;
	}

	.guide-container :global(ul > li) {
		position: relative;
		padding-left: 1rem;
	}

	.guide-container :global(ul > li::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65em;
		width: calc(var(--px) * 2);
		height: calc(var(--px) * 2);
		background: var(--color-p-gray);
	}

	.guide-container :global(ol) {
		list-style-type: decimal;
	}

	.guide-container :global(li) {
		margin: 0.6rem 0;
	}

	.guide-container :global(ol > li::marker) {
		color: var(--color-p-gray);
	}

	.guide-container :global(strong) {
		color: var(--color-p-white);
		font-weight: 600;
	}

	.guide-container :global(em) {
		color: var(--color-p-white);
		font-style: italic;
	}

	/* ── Code ── */

	.guide-container :global(code) {
		font-family: var(--font-pico);
		color: var(--color-p-red-1);
		font-size: 0.9rem;
	}

	.guide-container :global(pre) {
		background: var(--color-p-navy);
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		border: 3px solid var(--color-p-navy-light);
		margin: 1.5rem 0;
		font-size: 0.9rem;
		line-height: 1.8;
		white-space: pre-wrap;
	}

	.guide-container :global(pre code) {
		color: var(--color-p-lightgray);
		font-size: inherit;
	}

	/* ── Tables ── */

	.guide-container :global(table) {
		border-collapse: collapse;
		margin: 1.5rem 0;
		width: 100%;
		font-size: 18px;
	}

	.guide-container :global(td),
	.guide-container :global(th) {
		border: 3px solid var(--color-p-navy-light);
		padding: 0.6rem 0.8rem;
		text-align: left;
		color: var(--color-p-lightgray);
	}

	.guide-container :global(td code) {
		font-size: 0.9rem;
	}

	.guide-container :global(th) {
		color: var(--color-p-white);
		font-weight: 600;
	}

	/* ── Details/Summary (hints & solutions) ── */

	.guide-container :global(details) {
		border: 3px solid var(--color-p-navy-light);
		margin: 0.75rem 0;
		background: var(--color-p-navy-light);
		transition: border-color 0.15s steps(1);
	}

	.guide-container :global(details:hover) {
		border-color: var(--color-p-gray);
	}

	.guide-container :global(details[open]) {
		border-color: var(--color-p-gray);
	}

	.guide-container :global(details summary) {
		cursor: pointer;
		color: var(--color-p-gray);
		padding: 0.8rem 1.25rem;
		font-family: var(--font-pico);
		font-size: 0.9rem;
		user-select: none;
		transition: color 0.15s steps(1);
	}

	.guide-container :global(details:hover summary) {
		color: var(--color-p-lightgray);
	}

	.guide-container :global(details[open] summary) {
		color: var(--color-p-white);
		margin-bottom: 0;
		border-bottom: 3px solid var(--color-p-gray);
	}

	.guide-container :global(details > :not(summary)) {
		padding: 0 1.25rem;
	}

	.guide-container :global(details > p:last-child),
	.guide-container :global(details > pre:last-child) {
		margin-bottom: 1rem;
	}

	/* Code blocks inside details: inset (page-bg color) */
	.guide-container :global(details pre) {
		background: var(--color-p-navy);
	}

	/* ── Horizontal rules ── */

	.guide-container :global(hr) {
		border: none;
		height: var(--px);
		background: var(--color-p-navy-light);
		margin: 3.5rem 0;
	}

	/* ── Links ── */

	.guide-container :global(a) {
		color: var(--color-p-red-1);
		text-decoration: none;
	}

	.guide-container :global(a:hover) {
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 3px;
	}

	/* ── Images ── */

	.guide-container :global(img) {
		max-width: 100%;
		margin: 1.5rem 0;
		border: 3px solid var(--color-p-navy-light);
	}

	/* ── Inline button (CTA link) ── */

	.guide-container :global(.guide-button) {
		display: inline-block;
		font-family: var(--font-pico);
		font-size: 0.9rem;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--color-p-red-1);
		text-decoration: none;
		background: var(--color-p-navy);
		border: var(--px) solid var(--color-p-red-1);
		padding: calc(var(--px) * 4) calc(var(--px) * 5) calc(var(--px) * 3);
		margin: 1.5rem 0;
		position: relative;
		transition: background 0.1s steps(1), color 0.1s steps(1);
	}

	.guide-container :global(.guide-button)::before,
	.guide-container :global(.guide-button)::after {
		content: '';
		position: absolute;
		left: calc(var(--px) * -1);
		width: calc(100% + var(--px) * 2);
		height: var(--px);
		background: var(--color-p-red-3);
	}

	.guide-container :global(.guide-button)::before {
		bottom: calc(var(--px) * -2);
	}

	.guide-container :global(.guide-button)::after {
		bottom: calc(var(--px) * -3);
	}

	.guide-container :global(.guide-button:hover) {
		background: var(--color-p-red-1);
		color: var(--color-p-white);
		text-decoration: none;
	}

	.guide-container :global(.guide-button:active) {
		transform: translateY(var(--px));
	}

	.guide-container :global(.guide-button:active)::before,
	.guide-container :global(.guide-button:active)::after {
		display: none;
	}
</style>

<script lang="ts">
	import ShinyText from "$lib/ShinyText.svelte";
	import Particles from "$lib/Particles.svelte";
	import OutlineFilter from "$lib/OutlineFilter.svelte";
	import ShinyTitle from "$lib/ShinyTitle.svelte";
	import gsap from "gsap";
	import WorkshopForm from "$lib/WorkshopForm.svelte";

	let showEmailInput = $state(false);
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let hasError = $state(false);
	let errorMessage = $state("");
	let emailValue = $state("");
	let emailWrapper: HTMLDivElement = undefined!;
	let emailInputContainer: HTMLDivElement = undefined!;
	let fillElement: HTMLDivElement = undefined!;
	let errorWrapper: HTMLDivElement = undefined!;

	async function handleSubmit() {
		if (isSubmitting || isSubmitted) return;
		isSubmitting = true;
		hasError = false;
		errorMessage = "";

		try {
			const res = await fetch("/api/rsvp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: emailValue })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			isSubmitting = false;
			isSubmitted = true;

			if (errorWrapper.offsetHeight > 0) {
				gsap.to(errorWrapper, {
					height: 0,
					duration: 0.3,
					ease: "power3.out",
					onUpdate: function () {
						const current = parseFloat(gsap.getProperty(errorWrapper, "height") as string);
						errorWrapper.style.height = Math.round(current / 5) * 5 + "px";
					}
				});
			}
		} catch (err) {
			isSubmitting = false;
			hasError = true;
			isSubmitted = true;
			errorMessage = err instanceof Error ? err.message : "Something went wrong";

			gsap.fromTo(
				errorWrapper,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.3,
					ease: "power3.out",
					onUpdate: function () {
						const current = parseFloat(gsap.getProperty(errorWrapper, "height") as string);
						errorWrapper.style.height = Math.round(current / 5) * 5 + "px";
					}
				}
			);
		}

		const targetHeight = emailInputContainer.offsetHeight;
		gsap.fromTo(
			fillElement,
			{ y: 0 },
			{
				y: -targetHeight,
				duration: 0.4,
				ease: "power3.out",
				onUpdate: function () {
					const current = parseFloat(gsap.getProperty(fillElement, "y") as string);
					gsap.set(fillElement, { y: Math.round(current / 5) * 5 });
				},
				onComplete: function () {
					if (hasError) {
						setTimeout(() => {
							gsap.to(fillElement, {
								y: 0,
								duration: 0.4,
								ease: "power3.out",
								onUpdate: function () {
									const current = parseFloat(gsap.getProperty(fillElement, "y") as string);
									gsap.set(fillElement, { y: Math.round(current / 5) * 5 });
								},
								onComplete: function () {
									isSubmitted = false;
									hasError = false;
								}
							});
						}, 750);
					}
				}
			}
		);
	}

	function revealEmail() {
		if (showEmailInput) {
			handleSubmit();
			return;
		}
		showEmailInput = true;
		const targetHeight = emailWrapper.scrollHeight;
		gsap.fromTo(
			emailWrapper,
			{ height: 0 },
			{
				height: targetHeight,
				duration: 0.4,
				ease: "power3.out",
				onUpdate: function () {
					const current = parseFloat(gsap.getProperty(emailWrapper, "height") as string);
					emailWrapper.style.height = Math.round(current / 5) * 5 + "px";
				}
			}
		);
	}
</script>

<div class="absolute top-0 left-0 right-0 h-[100vh] bg-p-red-1 -translate-y-full pointer-events-none"></div>
<div class="relative min-h-[calc(100vh-20px)] w-full bg-p-navy overflow-hidden">
	<Particles density={20} maxSpeed={3} />
	<Particles density={3} minSpeed={2} maxSpeed={4} z={1} twColor="--color-p-gray" />
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<div class="relative mb-16 w-max mx-auto">
			<img
				src="/mountain.png"
				alt=""
				class="absolute top-1/2 left-1/2 -z-1 w-[375px] -translate-x-[calc(50%-10px)] -translate-y-[calc(50%+11px)] select-none"
				draggable="false"
			/>
            <p class="text-transparent selection:bg-p-red-1 font-title text-p8-title absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                downscale
            </p>
			<OutlineFilter style="pointer-events: none; user-select: none;">
                <div class="w-[415px] overflow-hidden aspect-[415/107]">
                    <img src="/downscale-plain-anim.png" alt="downscale" class="w-full animate-frame-swap"/>
                </div>
            </OutlineFilter>
            <!-- <img src="/downscale.png" alt="downscale" class="w-[425px] select-none" draggable="false" /> -->
		</div>
        <!-- <div class="px-1"> -->
        <div class="w-max mx-auto">
            <p>
                <ShinyText c1="var(--color-p-white)" c2="var(--color-p-lightgray)">
                    Make a retro game with
                </ShinyText>
                <a href="https://www.lexaloffle.com/pico-8.php" class="underline-p8 [--underline-color:var(--color-p-red-2)]" target="_blank">
                    <span id="shiny-text" class="text-p8 w-max text-transparent bg-clip-text bg-[linear-gradient(to_bottom,var(--color-p-red-1)_36%,var(--color-p-red-2)_36%)] hover:bg-[linear-gradient(to_bottom,var(--color-p-white)_36%,var(--color-p-lightgray)_36%)]">
                        PICO-8
                    </span>
                </a>
            </p>
            <div class="mt-4 w-max leading-9.5 mx-auto">
                <ShinyText c1="var(--color-p-white)" c2="var(--color-p-lightgray)">
                    Get a
                </ShinyText>
                <ShinyText c1="var(--color-p-red-1)" c2="var(--color-p-red-2)">
                    PICO-8 LICENSE
                </ShinyText>
                <br>
                <div class="ml-auto w-max text-right">
                    <ShinyText c1="var(--color-p-red-2)" c2="var(--color-p-red-3)">
                        + STEAM GIFTCARD
                    </ShinyText>
                    <br>
                    <ShinyText c1="var(--color-p-red-2)" c2="var(--color-p-red-3)">
                        + WALL POSTER
                    </ShinyText>
                    <br>
                    <ShinyText c1="var(--color-p-red-2)" c2="var(--color-p-red-3)">
                        + STICKERS
                    </ShinyText>
                </div>
            </div>
        </div>
	</div>
</div>

<!-- <div class="w-screen h-[225px] absolute z-2 -translate-y-[10vh] bg-[url(/mountains-loop.png)] bg-size-[auto_225px] bg-repeat-x"></div> -->

<img src="/down.png" alt="Scroll Down" class="w-[25px] absolute left-1/2 -translate-x-1/2 -translate-y-[12vh]">

<div class="bg-p-red-1 h-[20px] relative z-2">
    <div class="w-full h-[40px] -translate-y-full bg-[url(/divider-tile.png)] bg-size-[auto_100%] bg-repeat-x animate-move-bg"></div>
</div>

<div class=" bg-p-red-1 px-12 max-sm:px-4 pt-16 pb-36">
    
    <h1 class="text-p8-title leading-p8-title font-title pt-8 text-center -mb-[18.1px] relative z-1">
        <OutlineFilter>
            <ShinyTitle c1="var(--color-p-white)" c2="var(--color-p-lightgray)">
                coming very soon...
            </ShinyTitle>
        </OutlineFilter>
    </h1>

    <div class="bg-p-navy max-w-4xl mx-auto pt-10 pb-8 px-12 max-sm:px-6 relative z-0">        
        <p class="text-p8 text-white">
            <!-- <ShinyText c1="var(--color-p-red-1)" c2="var(--color-p-red-2)" style="display: inline;">
                <span class="relative before:absolute before:top-0 before:left-0 before:w-[calc(100%-5px)] before:h-[calc(100%-2.5px)] before:bg-p-navy-light before:-z-1">
                    DOWNSCALE
                </span>
            </ShinyText> -->

            downscale
            
            is a <span class="inline-block"><a href="https://hackclub.com" class="underline-p8 [--underline-color:var(--color-p-gray)] hover:bg-p-red-1" target="_blank">Hack Club</a> <img src="/new-tab.png" alt="" class="h-[30px] inline -ml-3"></span> program about building retro games with <span class="inline-block"><a href="https://www.lexaloffle.com/pico-8.php" class="underline-p8 [--underline-color:var(--color-p-gray)] hover:bg-p-red-1" target="_blank">PICO-8</a> <img src="/new-tab.png" alt="" class="h-[30px] inline -ml-3"></span>.


            
        </p>

        <div class="mt-10 mb-6 mx-auto w-full flex flex-col items-center max-w-xl">
            <div class="email-wrapper w-full" bind:this={emailWrapper}>
                <div class="email-inner">
                    <div class="relative overflow-hidden" bind:this={emailInputContainer}>
                        <input
                            type="email"
                            placeholder="YOUR EMAIL"
                            bind:value={emailValue}
                            disabled={isSubmitted && !hasError}
                            class="border-p-red-2 border-[5px] pt-[10px] pb-[6px] px-[15px] w-full text-p8 text-p-red-1 placeholder:text-p-red-2/50 focus:outline-none disabled:cursor-default"
                        />
                        {#if isSubmitting}
                            <div class="absolute right-[20px] top-1/2 -translate-y-1/2">
                                <OutlineFilter>
                                    <div class="w-[25px] h-[25px] overflow-hidden">
                                        <img src="/spinner.png" alt="" class="w-full animate-spinner scale-105 origin-top" />
                                    </div>
                                </OutlineFilter>
                            </div>
                        {/if}
                        <div
                            bind:this={fillElement}
                            class="absolute top-full left-0 right-0 h-full bg-p-red-1 flex items-center justify-center"
                        >
                            {#if hasError}
                                <img src="/x.png" alt="" class="w-[25px] h-[25px]" />
                            {:else}
                                <span class="text-p8 text-p-white flex items-center gap-[10px] translate-y-[3px]">YOU'RE ALL SET <img src="/checkmark.png" alt="" class="w-[25px] h-[20px]" /></span>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            <button
                onclick={revealEmail}
                class="border-p-red-1 border-[5px] pt-[10px] pb-[6px] px-[15px] text-center w-full relative after:absolute after:w-[calc(100%+10px)] after:h-[5px] after:-left-[5px] after:-bottom-[15px] after:bg-p-red-3 before:absolute before:w-[calc(100%+10px)] before:h-[5px] before:-left-[5px] before:-bottom-[10px] hover:bg-p-red-1 group cursor-pointer active:translate-y-[5px] active:after:hidden active:before:hidden"
            >
                <span class="text-p8 text-p-red-1">
                    <span id="shiny-text" class="text-p8 w-max text-transparent bg-clip-text bg-[linear-gradient(to_bottom,var(--color-p-red-1)_36%,var(--color-p-red-2)_36%)] group-hover:bg-[linear-gradient(to_bottom,var(--color-p-white)_36%,var(--color-p-white)_36%)]">
                        TELL ME WHEN IT'S HERE
                    </span>
                </span>
            </button>
            <div bind:this={errorWrapper} class="h-0 overflow-hidden">
                <p class="text-p8 text-p-red-2 pt-[26px] text-center">{errorMessage}</p>
            </div>
        </div>
    </div>    

    <section class="workshop-panel bg-p-navy-light max-w-4xl mx-auto px-12 max-sm:px-6 py-18 relative z-0 mt-12">
        <div class="workshop-panel__notches" aria-hidden="true"></div>
        <div class="workshop-panel__notches-bottom" aria-hidden="true"></div>
        <div class="grid grid-cols-[auto_1fr] max-md:grid-cols-1 gap-x-8 gap-y-5 items-start">
            <div class="workshop-kicker text-p8 text-p-gray uppercase leading-none max-md:w-max">
                clubs
            </div>
            <div>
                <h2 class="text-p8 text-p-white mb-5 leading-[1.35]">
                    RUN A WORKSHOP!
                </h2>
                <p class="text-p8 text-p-white">
                    Existing clubs are invited to run a downscale workshop! Don't have a club and interested in running one? <span class="inline-block"><a href="https://hackclub.com" class="underline-p8 [--underline-color:var(--color-p-gray)] hover:bg-p-red-1" target="_blank">Start a new club</a><img src="/new-tab.png" alt="" class="h-[30px] inline ml-1"></span>!
                </p>
                <WorkshopForm />
            </div>
        </div>
    </section>
</div>

<!-- <div class="bg-p-red-1 relative z-2">
    <div class="w-screen h-[100px] -translate-y-[65px] bg-[url(/divider-tentacles.png)] bg-size-[auto_100%] bg-repeat-x"></div>
</div> -->
<div class="sticky bottom-0 h-screen bg-p-navy -mt-[100vh] -z-10 pointer-events-none"></div>

<style>
	:global(*) {
		image-rendering: pixelated;
	}
    :global(html) {
        background-color: var(--color-p-red-1);
    }

    .animate-move-bg {
        animation: move-bg 8s linear infinite;
    }
    @keyframes move-bg {
        from {
            background-position: 0 0;
        }
        to {
            background-position: var(--bg-width, 50px) 0;
        }
    }

    .email-wrapper {
        height: 0;
        overflow: hidden;
    }

    .email-inner {
        padding-bottom: 10px;
    }

    .workshop-panel {
        border-bottom: 10px solid var(--color-p-navy);
    }

    .workshop-panel__notches {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
            linear-gradient(90deg, var(--color-p-red-1) 40px, transparent 5px) top left / 80px 5px repeat-x,
            linear-gradient(90deg, transparent 40px, var(--color-p-navy) 5px, var(--color-p-navy) 80px, transparent 10px) bottom left / 80px 5px repeat-x;
    }
    .workshop-panel__notches-bottom {
        position: absolute;
        transform: translateY(15px);
        inset: 0;
        pointer-events: none;
        background:
            linear-gradient(90deg, var(--color-p-navy) 40px, transparent 5px, transparent 80px, var(--color-p-navy) 10px) bottom left / 80px 5px repeat-x;
    }

    .workshop-kicker {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        padding-top: 5px;
    }

    @media (max-width: 767px) {
        .workshop-kicker {
            writing-mode: horizontal-tb;
            transform: none;
        }
    }

    .animate-frame-swap {
        animation: frame-swap 4s steps(1) infinite;
    }
    @keyframes frame-swap {
        0%, 50% {
            transform: translateY(0);
        }
        50.01%, 100% {
            transform: translateY(-50%);
        }
    }

    .animate-spinner {
        animation: spinner 1s steps(16) infinite;
    }
    @keyframes spinner {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100%);
        }
    }
</style>
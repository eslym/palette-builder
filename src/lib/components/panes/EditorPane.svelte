<script lang="ts">
	import ColorEditor from '$lib/components/ColorEditor.svelte';
	import { dragEffects, Draggable, dragState } from '$lib/components/draggable';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from '@lucide/svelte';
	import { last } from 'lodash-es';
	import { tick } from 'svelte';

	type ColorRecord = { name: string; lightDark: boolean; light: string; dark: string };

	let { colors = $bindable() }: { colors: ColorRecord[] } = $props();

	let dragging = $state(-1);

	let container: HTMLDivElement = $state(null!);

	let scrollTop = $state(0);
	let clientHeight = $state(0);
	let innerHeight = $state(0);

	let canScrollUp = $derived(scrollTop > 0);
	let canScrollDown = $derived(scrollTop < innerHeight - clientHeight);

	let scrollDiff = $state(0);

	$effect(() => {
		if (!dragState.dragging || scrollDiff === 0) return;
		const interval = setInterval(() => (container.scrollTop += scrollDiff), 50);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (dragState.dragging) {
			document.body.style = 'cursor: grabbing !important;';
		} else {
			document.body.style = '';
		}
	});
</script>

{#if dragState.dragging}
	{#if canScrollUp}
		<div
			class="absolute top-0 z-10 h-[25px] w-full"
			use:dragEffects
			ondraggingover={() => (scrollDiff = -10)}
			ondraggingout={() => (scrollDiff = 0)}
		></div>
	{/if}
	{#if canScrollDown}
		<div
			class="absolute bottom-0 z-10 h-[25px] w-full"
			use:dragEffects
			ondraggingover={() => (scrollDiff = 10)}
			ondraggingout={() => (scrollDiff = 0)}
		></div>
	{/if}
{/if}
<div
	bind:this={container}
	class="relative flex h-full w-full overflow-auto"
	onscroll={() => (scrollTop = container.scrollTop)}
	bind:clientHeight
>
	<div
		bind:clientHeight={innerHeight}
		class="flex h-max w-full flex-col items-center gap-2.5 px-2 pt-2 pb-8"
	>
		{#each colors as color, i (color)}
			<Draggable ondraggingstart={() => (dragging = i)}>
				{#snippet draggingView({ dimensions, offset, cursor })}
					<div
						class="bg-card border-border text-card-foreground fixed grid grid-cols-[auto_1fr_auto] gap-2 rounded-md border-1 px-2 py-4 shadow"
						style:width="{dimensions.width}px"
						style:height="{dimensions.height}px"
						style:margin-top="{cursor.y - offset.y}px"
						style:margin-left="{cursor.x - offset.x}px"
						inert
					>
						<ColorEditor {color} />
					</div>
				{/snippet}
				{#snippet children({ dragHandle, dragTarget, isDragging })}
					<div
						use:dragTarget
						use:dragEffects
						class="bg-card border-border text-card-foreground ring-border grid w-full grid-cols-[auto_1fr_auto] gap-2 rounded-md border-1 px-2 py-4"
						class:opacity-45={isDragging}
						class:ring={isDragging}
						class:pointer-events-none={isDragging}
						ondraggingover={() => {
							if (dragging === i) return;
							const scroll = container.scrollTop;
							const current = colors.splice(dragging, 1)[0];
							colors.splice(i, 0, current);
							dragging = i;
							tick().then(() => {
								container.scrollTop = scroll;
							});
						}}
					>
						<ColorEditor
							bind:color={colors[i]}
							handle={dragHandle}
							onremove={() => colors.splice(i, 1)}
						/>
					</div>
				{/snippet}
			</Draggable>
		{/each}
		<Button
			variant="secondary"
			size="lg"
			onclick={() =>
				colors.push({ name: '', lightDark: Boolean(last(colors)?.lightDark), light: '', dark: '' })}
		>
			<PlusIcon />
			Add
		</Button>
	</div>
</div>

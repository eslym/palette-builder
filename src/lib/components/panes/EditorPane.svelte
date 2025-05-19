<script lang="ts">
	import ColorEditor from '$lib/components/ColorEditor.svelte';
	import { dragEffects, Draggable } from '$lib/components/draggable';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from '@lucide/svelte';
	import { last } from 'lodash-es';

	type ColorRecord = { name: string; lightDark: boolean; light: string; dark: string };

	let { colors = $bindable() }: { colors: ColorRecord[] } = $props();

	let dragging = $state(-1);
</script>

<div class="flex h-full w-full flex-col items-center gap-2.5 overflow-auto px-2 pt-2 pb-8">
	{#each colors as color, i (color)}
		<Draggable ondraggingstart={() => (dragging = i)}>
			{#snippet draggingView({ dimensions, offset, cursor })}
				<div
					class="bg-card border-border text-card-foreground fixed flex flex-row items-center gap-2 rounded-md border-1 px-2 py-4 shadow"
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
					class="bg-card border-border text-card-foreground ring-border flex w-full flex-row items-center gap-2 rounded-md border-1 px-2 py-4"
					class:opacity-45={isDragging}
					class:ring={isDragging}
					ondraggingover={() => {
						if (dragging === i) return;
						const current = colors[dragging];
						colors[dragging] = colors[i];
						colors[i] = current;
						dragging = i;
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

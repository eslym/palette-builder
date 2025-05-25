<script lang="ts">
	import type { Action } from 'svelte/action';
	import { noop } from 'lodash-es';
	import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, TrashIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import type { MouseEventHandler } from 'svelte/elements';
	import ColorPreview from '$lib/components/ColorPreview.svelte';

	const _id = $props.id();

	let {
		color = $bindable(),
		handle = noop,
		onremove
	}: {
		color: ColorRecord & { collapsed?: boolean };
		handle?: Action<HTMLElement>;
		onremove?: MouseEventHandler<HTMLElement>;
	} = $props();

	function id(suffix: string) {
		if (handle === noop) return undefined;
		return `${_id}-${suffix}`;
	}
</script>

<div class="text-muted-foreground flex h-full w-8 cursor-grab flex-row items-center p-1" use:handle>
	<ChevronsUpDownIcon class="size-6" />
</div>
<div class="grid grow grid-cols-[auto_1fr] gap-x-4 gap-y-2">
	<Label for={id('name')} class="text-right">Variable Name</Label>
	<div class="flex flex-row gap-2">
		<Input id={id('name')} class="grow" bind:value={color.name} />
		{#if color.collapsed}
			<ColorPreview bind:color={color.light} droppable />
			{#if color.lightDark}
				<ColorPreview bind:color={color.dark} droppable />
			{/if}
			<Button variant="destructive" size="icon" class="ml-2" onclick={onremove}>
				<TrashIcon class="size-4" />
			</Button>
		{/if}
	</div>
	{#if !color.collapsed}
		<Label for={id('light-dark')} class="text-right">Light Dark</Label>
		<Switch id={id('light-dark')} bind:checked={color.lightDark} />
		<Label for={id('light')} class="text-right">Color</Label>
		<div class="flex flex-row gap-1">
			<Input
				id={id('light')}
				bind:value={color.light}
				class="grow"
				placeholder={color.lightDark ? 'Light Color' : ''}
			/>
			<ColorPreview bind:color={color.light} droppable />
			{#if color.lightDark}
				<Input id={id('dark')} bind:value={color.dark} class="ml-4 grow" placeholder="Dark Color" />
				<ColorPreview bind:color={color.dark} droppable />
			{/if}
		</div>
	{/if}
</div>
<div class="flex h-full flex-col items-start justify-between">
	<Button variant="ghost" size="icon" onclick={() => (color.collapsed = !color.collapsed)}>
		{#if color.collapsed}
			<ChevronDownIcon class="size-4" />
		{:else}
			<ChevronUpIcon class="size-4" />
		{/if}
	</Button>
	{#if !color.collapsed}
		<Button variant="destructive" size="icon" class="mt-auto" onclick={onremove}>
			<TrashIcon class="size-4" />
		</Button>
	{/if}
</div>

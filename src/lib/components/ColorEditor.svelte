<script lang="ts">
	import type { Action } from 'svelte/action';
	import { noop } from 'lodash-es';
	import { ChevronsUpDownIcon, MinusIcon } from '@lucide/svelte';
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
		color: ColorRecord;
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
	<Input id={id('name')} bind:value={color.name} />
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
		<ColorPreview color={color.light} />
		{#if color.lightDark}
			<Input id={id('dark')} bind:value={color.dark} class="ml-4 grow" placeholder="Dark Color" />
			<ColorPreview color={color.dark} />
		{/if}
	</div>
</div>
<div class="h-full items-start">
	<Button variant="destructive" size="icon" onclick={onremove}>
		<MinusIcon class="size-4" />
	</Button>
</div>

<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as radixColors from '@radix-ui/colors';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { ChevronsUpDownIcon } from '@lucide/svelte';
	import { scaleNames } from '$lib/radix';
	import { local } from '$lib/store';
	import { tick } from 'svelte';
	import Colors from 'colorjs.io';
	import ColorBlock from '$lib/components/ColorBlock.svelte';

	let popup = $state(false);
	let triggerRef: HTMLElement = $state(null!);

	let selected = $derived(local['selected-radix']);
</script>

<Button href="https://www.radix-ui.com/colors" variant="secondary" target="_blank">
	Source: RadixUI Colors
</Button>

<div class="my-8 px-2">
	<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
		<Label for="radix-base">Color</Label>
		<Popover.Root bind:open={popup}>
			<Popover.Trigger
				bind:ref={triggerRef}
				id="radix-base"
				class={buttonVariants({ variant: 'outline', class: 'justify-start' })}
				role="combobox"
				aria-expanded={popup}
			>
				{#if selected}
					<svg
						class="border-border size-4 rounded-md border-1"
						viewBox="0 0 16 16"
						style:background-color="light-dark({(radixColors as any)[`${selected}P3`][
							`${selected}9`
						]}, {(radixColors as any)[`${selected}DarkP3`][`${selected}9`]})"
					></svg>
				{/if}
				<span
					class:capitalize={local['selected-radix']}
					class:text-muted-foreground={!local['selected-radix']}
				>
					{local['selected-radix'] ?? 'Select a color'}
				</span>
				<ChevronsUpDownIcon class="ml-auto opacity-50" />
			</Popover.Trigger>
			<Popover.Content class="w-[var(--bits-popover-anchor-width)] p-0">
				<Command.Root>
					<Command.Input placeholder="Search..." />
					<Command.List>
						<Command.Empty>No results found.</Command.Empty>
						<Command.Group>
							{#each scaleNames as key}
								<Command.Item
									class="capitalize"
									value={key}
									onSelect={() => {
										local['selected-radix'] = key;
										popup = false;
										tick().then(() => {
											triggerRef.focus();
										});
									}}
								>
									<svg
										class="border-border size-4 rounded-md border-1"
										viewBox="0 0 16 16"
										style:background-color="light-dark({(radixColors as any)[`${key}P3`][
											`${key}9`
										]}, {(radixColors as any)[`${key}DarkP3`][`${key}9`]})"
									></svg>
									{key}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>
	{#if selected}
		{@const light = (radixColors as any)[`${selected}P3`]}
		{@const lightA = (radixColors as any)[`${selected}P3A`]}
		{@const dark = (radixColors as any)[`${selected}DarkP3`]}
		{@const darkA = (radixColors as any)[`${selected}DarkP3A`]}
		<table class="mt-4">
			<thead class="text-xs">
				<tr>
					<th></th>
					<th class="w-0 px-1 py-0.5" colspan="2">Backgrounds</th>
					<th class="w-0 px-1 py-0.5" colspan="3">Interactive components</th>
					<th class="w-0 px-1 py-0.5" colspan="3">Borders and separators</th>
					<th class="w-0 px-1 py-0.5" colspan="2">Solid colors</th>
					<th class="w-0 px-1 py-0.5" colspan="2">Accessible text</th>
				</tr>
				<tr>
					<th></th>
					{#each { length: 12 } as _, i}
						<th>{i + 1}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<tr>
					<th class="px-1 py-0.5 text-xs"> Light </th>
					{@render render_scale(light, (i) => `${selected}${i}`)}
				</tr>
				<tr>
					<th class="px-1 py-0.5 text-xs"> Alpha </th>
					{@render render_scale(lightA, (i) => `${selected}A${i}`)}
				</tr>
				<tr class="h-3"></tr>
				<tr>
					<th class="px-1 py-0.5 text-xs"> Dark </th>
					{@render render_scale(dark, (i) => `${selected}${i}`)}
				</tr>
				<tr>
					<th class="px-1 py-0.5 text-xs"> Alpha </th>
					{@render render_scale(darkA, (i) => `${selected}A${i}`)}
				</tr>
			</tbody>
		</table>
	{/if}
</div>

{#snippet render_scale(scales: Record<string, string>, key: (n: number) => string)}
	{#each { length: 12 } as _, i}
		{@const color = new Colors(scales[key(i + 1)]).to('oklch').toString({ precision: 4 })}
		<td class="px-1 py-0.5">
			<ColorBlock {color} />
		</td>
	{/each}
{/snippet}

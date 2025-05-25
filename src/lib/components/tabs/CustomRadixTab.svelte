<script lang="ts">
	import ColorBlock from '$lib/components/ColorBlock.svelte';
	import ColorPreview from '$lib/components/ColorPreview.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { generateRadixColors } from '$lib/radix';
	import { local } from '$lib/store';
	import { try_catch } from '$lib/utils';
	import Color from 'colorjs.io';
	import { cloneDeep } from 'lodash-es';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator';
	import { CheckIcon, Trash2Icon } from '@lucide/svelte';

	type Config = {
		accent: string;
		gray: string;
		background: string;
	};
	type RadixConfig = {
		light: Config;
		dark: Config;
	};

	let presets: RadixConfig[] = $state(JSON.parse(local['radix-presets'] ?? '[]'));

	let config: RadixConfig = $state(
		JSON.parse(local['radix-config'] ?? 'null') ?? {
			light: {
				accent: '',
				gray: '',
				background: ''
			},
			dark: {
				accent: '',
				gray: '',
				background: ''
			}
		}
	);

	let light_colors = $derived(
		ensure_valid(config.light)
			? generateRadixColors({ appearance: 'light', ...config.light })
			: null
	);
	let dark_colors = $derived(
		ensure_valid(config.dark) ? generateRadixColors({ appearance: 'dark', ...config.dark }) : null
	);

	$effect(() => {
		local['radix-config'] = JSON.stringify(config);
	});

	$effect(() => {
		local['radix-presets'] = JSON.stringify(presets);
	});

	function ensure_valid(config: Config) {
		const [_a, err_a] = try_catch(() => new Color(config.accent));
		const [_g, err_g] = try_catch(() => new Color(config.gray));
		const [_b, err_b] = try_catch(() => new Color(config.background));
		if (err_a || err_g || err_b) {
			return null;
		}
		return true;
	}
</script>

<Button href="https://www.radix-ui.com/colors/custom" variant="secondary" target="_blank">
	Source: RadixUI Colors
</Button>

<div class="my-8 px-2">
	<div class="grid grid-cols-[auto_1fr_1fr] gap-x-2.5 gap-y-2">
		<div></div>
		<div class="text-center text-xs font-semibold">Light</div>
		<div class="text-center text-xs font-semibold">Dark</div>
		<div class="flex items-center text-center text-xs font-semibold">Accent</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.light.accent} class="grow" />
			<ColorPreview droppable bind:color={config.light.accent} />
		</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.dark.accent} class="grow" />
			<ColorPreview droppable bind:color={config.dark.accent} />
		</div>
		<div class="flex items-center text-center text-xs font-semibold">Gray</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.light.gray} class="grow" />
			<ColorPreview droppable bind:color={config.light.gray} />
		</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.dark.gray} class="grow" />
			<ColorPreview droppable bind:color={config.dark.gray} />
		</div>
		<div class="flex items-center text-center text-xs font-semibold">Background</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.light.background} class="grow" />
			<ColorPreview droppable bind:color={config.light.background} />
		</div>
		<div class="flex flex-row gap-1">
			<Input bind:value={config.dark.background} class="grow" />
			<ColorPreview droppable bind:color={config.dark.background} />
		</div>
	</div>
	<div class="mt-4 flex flex-row justify-end gap-2">
		{@render preset_dialog()}
		<Button
			variant="default"
			onclick={() => {
				presets.push(cloneDeep(config));
				toast('Preset saved');
			}}
		>
			Save Preset
		</Button>
	</div>
	<div class="mt-8 w-min">
		{#if light_colors}
			<p class="text-muted-foreground my-4 text-center text-xs font-bold">Light Colors</p>
			{@render render_table(light_colors)}
		{/if}
		{#if dark_colors}
			<p class="text-muted-foreground my-4 text-center text-xs font-bold">Dark Colors</p>
			{@render render_table(dark_colors)}
		{/if}
	</div>
</div>

{#snippet preset_dialog()}
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'secondary' })}>Load Preset</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Presets</Dialog.Title>
			</Dialog.Header>
			<Separator />
			<div class="flex max-h-[50dvh] flex-col gap-2.5 overflow-auto">
				{#each presets as preset, i}
					{@const colors = Object.values(preset)
						.map((c) => Object.values(c))
						.flat()}
					<div class="flex flex-row items-center gap-1.5">
						{#each colors as color}
							<ColorPreview {color} />
						{/each}
						<Dialog.Close
							class={buttonVariants({ variant: 'secondary', size: 'icon', class: 'ml-auto' })}
							onclick={() => {
								config = cloneDeep(preset);
								toast('Preset loaded');
							}}
						>
							<CheckIcon />
						</Dialog.Close>
						<Button
							variant="destructive"
							size="icon"
							onclick={() => {
								presets.splice(i, 1);
								toast('Preset removed');
							}}
						>
							<Trash2Icon />
						</Button>
					</div>
				{:else}
					<div class="flex items-center justify-center py-8 text-muted-foreground">No presets</div>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

{#snippet render_table(colors: ReturnType<typeof generateRadixColors>)}
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
				<th class="px-1 py-0.5 text-xs"> Accent </th>
				{@render render_scale(colors.accentScale)}
			</tr>
			<tr>
				<th class="px-1 py-0.5 text-xs"> Alpha </th>
				{@render render_scale(colors.accentScaleAlpha)}
			</tr>
			<tr class="h-3"></tr>
			<tr>
				<th class="px-1 py-0.5 text-xs"> Gray </th>
				{@render render_scale(colors.grayScale)}
			</tr>
			<tr>
				<th class="px-1 py-0.5 text-xs"> Alpha </th>
				{@render render_scale(colors.grayScaleAlpha)}
			</tr>
		</tbody>
	</table>
{/snippet}

{#snippet render_scale(scale: string[])}
	{#each scale as color}
		<td class="px-1 py-0.5">
			<ColorBlock {color} />
		</td>
	{/each}
{/snippet}

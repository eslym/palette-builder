<script lang="ts" module>
	export const formats = {
		oklch: {
			space: 'oklch',
			format: 'oklch'
		},
		hex: {
			space: 'srgb',
			format: 'hex'
		},
		rgb: {
			space: 'srgb',
			format: 'rgb'
		},
		hsl: {
			space: 'hsl',
			format: 'hsl'
		}
	} as Record<string, { space: string; format: string }>;

	const white = new Color('white');
	const black = new Color('black');

	function isDark(color: Color) {
		return color.contrastLstar(white) > color.contrastLstar(black);
	}
</script>

<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Color from 'colorjs.io';
	import { local } from '$lib/store';
	import { toast } from 'svelte-sonner';
	import ColorPreview from '$lib/components/ColorPreview.svelte';

	let {
		color,
		name,
		label = undefined
	}: { color: string; name?: string; label?: string } = $props();

	let format = $derived(local['color-format'] ?? 'oklch');
	let _format = $derived(formats[format]);
	let _color = $derived(new Color(color));

	let display = $derived(
		_color.to(_format.space).toString({ format: _format.format, precision: 4 })
	);

	function copy(format: string) {
		const _format = formats[format];
		const text = _color.to(_format.space).toString({ format: _format.format, precision: 4 });
		navigator.clipboard.writeText(text);
		toast('Copied to clipboard');
	}
</script>

{#snippet render_button({ props }: { props: Record<string, unknown> })}
	<Tooltip.Provider>
		<Tooltip.Root>
			<div class="contents">
				<Tooltip.Trigger
					{...props}
					class={buttonVariants({
						variant: 'outline',
						size: 'icon',
						class: 'checkerboard cursor-grab overflow-hidden'
					})}
					onclick={() => copy(format)}
					ondragstart={(ev) => {
						if (!ev.dataTransfer) return;
						ev.dataTransfer.setData('text/plain', display);
						ev.dataTransfer.dropEffect = 'copy';
						ev.dataTransfer.effectAllowed = 'copy';
					}}
					draggable
				>
					<div
						class="flex h-full w-full items-center justify-center text-xs font-semibold"
						style="background-color: {display}"
						class:text-white={isDark(_color)}
						class:text-black={!isDark(_color)}
					>
						{label}
					</div>
				</Tooltip.Trigger>
			</div>
			<Tooltip.Content class="flex flex-row items-center gap-2 text-xs">
				<ColorPreview {color} />
				<div class="grow">
					{#if name}
						<p class="font-semibold capitalize">{name}</p>
					{/if}
					<p class="font-mono">{display}</p>
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
{/snippet}

<ContextMenu.Root>
	<ContextMenu.Trigger child={render_button} />
	<ContextMenu.Content>
		<ContextMenu.Item onclick={() => copy('oklch')}>
			Copy <code class="font-mono">oklch</code>
		</ContextMenu.Item>
		<ContextMenu.Item onclick={() => copy('hex')}>
			Copy <code class="font-mono">hex</code>
		</ContextMenu.Item>
		<ContextMenu.Item onclick={() => copy('rgb')}>
			Copy <code class="font-mono">rgb</code>
		</ContextMenu.Item>
		<ContextMenu.Item onclick={() => copy('hsl')}>
			Copy <code class="font-mono">hsl</code>
		</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.RadioGroup bind:value={() => format, (val) => (local['color-format'] = val)}>
			<ContextMenu.GroupHeading class="text-muted-foreground text-xs">
				Default Format
			</ContextMenu.GroupHeading>
			<ContextMenu.RadioItem value="oklch">
				<code class="font-mono">oklch</code>
			</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="hex">
				<code class="font-mono">hex</code>
			</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="rgb">
				<code class="font-mono">rgb</code>
			</ContextMenu.RadioItem>
			<ContextMenu.RadioItem value="hsl">
				<code class="font-mono">hsl</code>
			</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup>
	</ContextMenu.Content>
</ContextMenu.Root>

<style>
	div :global(.checkerboard) {
		background: repeating-conic-gradient(#fff 0% 25%, #000 0% 50%, #fff 0% 75%, #000 0% 100%);
		background-size: 100% 100%;
		background-clip: padding-box;
	}
</style>

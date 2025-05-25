<script lang="ts">
	import ColorBlock from '$lib/components/ColorBlock.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { toast } from 'svelte-sonner';
	import colors from 'tailwindcss/colors';

	const tailwind_keys = [
		'red',
		'orange',
		'amber',
		'yellow',
		'lime',
		'green',
		'emerald',
		'teal',
		'cyan',
		'sky',
		'blue',
		'indigo',
		'violet',
		'purple',
		'fuchsia',
		'pink',
		'rose',
		'slate',
		'gray',
		'zinc',
		'neutral',
		'stone'
	] as const;

	const tailwind_variants = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
</script>

<Button href="https://tailwindcss.com/docs/colors" variant="secondary" target="_blank">
	Source: TailwindCSS
</Button>
<table class="mt-4">
	<thead>
		<tr>
			<th></th>
			{#each tailwind_variants as variant}
				<th class="text-xs">{variant}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tailwind_keys as key}
			<tr>
				<th class="px-1 py-0.5 text-xs capitalize">{key}</th>
				{#each tailwind_variants as variant}
					<td class="p-0.5">
						<ColorBlock color={colors[key][variant]} name="{key} {variant}" label={`${variant}`} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

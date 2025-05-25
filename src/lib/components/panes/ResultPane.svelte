<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { type Snippet } from 'svelte';
	import { local } from '$lib/store';
	import { camelCase, kebabCase } from 'lodash-es';

	let { colors }: { colors: ColorRecord[] } = $props();

	function css_value(record: ColorRecord) {
		if (record.lightDark) {
			return `light-dark(${record.light}, ${record.dark})`;
		}
		return record.light;
	}

	function css_code(colors: ColorRecord[]) {
		const lines = [':root {'];
		for (const record of colors) {
			lines.push(`\t--${record.name}: ${css_value(record)};`);
		}
		lines.push('}', '');
		return lines.join('\n');
	}

	function stylex_code(colors: ColorRecord[]) {
		const lines = [
			'import * as stylex from "@stylexjs/stylex";',
			'',
			'export const colors = stylex.defineVars({'
		];
		for (const record of colors) {
			lines.push(`\t${record.name}: ${JSON.stringify(css_value(record))},`);
		}
		lines.push('});', '');
		return lines.join('\n');
	}
</script>

{#snippet render_tab(key: string, children: Snippet)}
	<Tabs.Content value={key} class="h-0 w-full grow">
		<Card.Root class="h-full w-full overflow-auto">
			<Card.Content>
				{@render children()}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
{/snippet}

{#snippet css_tab()}
	<pre>{css_code(colors)}</pre>
{/snippet}

{#snippet stylex_tab()}
	<pre>{stylex_code(colors)}</pre>
{/snippet}

<Tabs.Root
	class="h-full w-full"
	bind:value={() => local['result-tab'] ?? 'css', (val) => (local['result-tab'] = val)}
>
	<Tabs.List class="w-full">
		<Tabs.Trigger value="css">CSS</Tabs.Trigger>
		<Tabs.Trigger value="stylex">StyleX</Tabs.Trigger>
	</Tabs.List>
	{@render render_tab('css', css_tab)}
	{@render render_tab('stylex', stylex_tab)}
</Tabs.Root>

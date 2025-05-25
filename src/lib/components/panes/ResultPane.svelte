<script lang="ts" module>
	function light_dark(record: ColorRecord) {
		if (record.lightDark) {
			return `light-dark(${record.light}, ${record.dark})`;
		}
		return record.light;
	}

	const cases = new Map([
		[null, { label: 'None', fn: (str: string) => str }],
		['camel', { label: 'Camel Case', fn: (str: string) => camelCase(str) }],
		['kebab', { label: 'Kebab Case', fn: (str: string) => kebabCase(str) }],
		['snake', { label: 'Snake Case', fn: (str: string) => snakeCase(str) }]
	]);

	const darkMode = new Map([
		[
			null,
			{
				label: 'light-dark function',
				css(colors: ColorRecord[], case_convert: (str: string) => string) {
					const lines = [':root {'];
					for (const record of colors) {
						lines.push(`\t--${case_convert(record.name)}: ${light_dark(record)};`);
					}
					lines.push('}', '');
					return lines.join('\n');
				},
				stylex(colors: ColorRecord[], case_convert: (str: string) => string) {
					const lines = ['export const colors = stylex.defineVars({'];
					for (const record of colors) {
						lines.push(
							`\t${case_convert(record.name)}: light_dark(${JSON.stringify(record.light)}, ${JSON.stringify(record.dark)}),`
						);
					}
					lines.push('});', '');
					return lines.join('\n');
				}
			}
		],
		[
			'media',
			{
				label: 'Media Query',
				css(colors: ColorRecord[], case_convert: (str: string) => string) {
					const root = [':root {'];
					const media = ['@media (prefers-color-scheme: dark) {', '\t:root {'];
					for (const record of colors) {
						root.push(`\t--${case_convert(record.name)}: ${record.light};`);
						media.push(`\t\t--${case_convert(record.name)}: ${record.dark};`);
					}
					root.push('}', '');
					media.push('\t}', '}', '');
					return root.concat(media).join('\n');
				},
				stylex(colors: ColorRecord[], case_convert: (str: string) => string) {
					const lines = ['export const colors = stylex.defineVars({'];
					for (const record of colors) {
						lines.push(
							`\t${case_convert(record.name)}: {`,
							`\t\tdefault: ${JSON.stringify(record.light)},`,
							`\t\t'@media (prefers-color-scheme: dark)': ${JSON.stringify(record.dark)}`,
							'\t},'
						);
					}
					lines.push('});', '');
					return lines.join('\n');
				}
			}
		],
		[
			'class',
			{
				label: 'Class',
				css(colors: ColorRecord[], case_convert: (str: string) => string) {
					const root = [':root {'];
					const kelas = ['.dark {'];
					for (const record of colors) {
						root.push(`\t--${case_convert(record.name)}: ${record.light};`);
						kelas.push(`\t--${case_convert(record.name)}: ${record.dark};`);
					}
					root.push('}', '');
					kelas.push('}', '');
					return root.concat(kelas).join('\n');
				},
				stylex(colors: ColorRecord[], case_convert: (str: string) => string) {
					const vars = ['export const colors = stylex.defineVars({'];
					const theme = ['export const darkTheme = stylex.createTheme(colors, {'];
					for (const record of colors) {
						vars.push(`\t${case_convert(record.name)}: ${JSON.stringify(record.light)},`);
						theme.push(`\t${case_convert(record.name)}: ${JSON.stringify(record.dark)},`);
					}
					vars.push('});', '');
					theme.push('});', '');
					return vars.concat(theme).join('\n');
				}
			}
		]
	]);
</script>

<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { type Snippet } from 'svelte';
	import { local } from '$lib/store';
	import { camelCase, kebabCase, snakeCase } from 'lodash-es';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	let { colors }: { colors: ColorRecord[] } = $props();

	let css_case = $derived(cases.get(local['css-case'])!.fn);
	let stylex_case = $derived(cases.get(local['stylex-case'])!.fn);

	$inspect(css_case, stylex_case);
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

{#snippet controls(type: 'css' | 'stylex')}
	<div class="mb-6 flex flex-row flex-wrap gap-x-6 gap-y-2">
		<div class="flex flex-row items-center gap-2">
			<Label for="{type}-case">Case Convert</Label>
			<Select.Root type="single" bind:value={local[`${type}-case`]!}>
				<Select.Trigger id="{type}-case" class="w-36">
					{cases.get(local[`${type}-case`])!.label}
				</Select.Trigger>
				<Select.Content>
					{#each Array.from(cases.entries()) as [value, { label }]}
						<Select.Item value={value!}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-row items-center gap-2">
			<Label for="{type}-dark-mode">Dark Mode</Label>
			<Select.Root type="single" bind:value={local[`${type}-dark-mode`]!}>
				<Select.Trigger id="{type}-dark-mode" class="w-44">
					{darkMode.get(local[`${type}-dark-mode`])!.label}
				</Select.Trigger>
				<Select.Content>
					{#each Array.from(darkMode.entries()) as [value, { label }]}
						<Select.Item value={value!}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
{/snippet}

{#snippet css_tab()}
	{@const dark_mode = darkMode.get(local['css-dark-mode'])!}
	{@render controls('css')}
	<pre>{dark_mode.css(colors, css_case)}</pre>
{/snippet}

{#snippet stylex_tab()}
	{@const dark_mode = darkMode.get(local['stylex-dark-mode'])!}
	{@render controls('stylex')}
	<pre>{dark_mode.stylex(colors, stylex_case)}</pre>
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

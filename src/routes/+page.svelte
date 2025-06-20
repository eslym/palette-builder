<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import TailwindTab from '$lib/components/tabs/TailwindTab.svelte';
	import RadixTab from '$lib/components/tabs/RadixTab.svelte';
	import { type Component } from 'svelte';
	import CustomRadixTab from '$lib/components/panes/CustomRadixPane.svelte';
	import { local } from '$lib/store';
	import EditorPane from '$lib/components/panes/EditorPane.svelte';
	import ResultPane from '$lib/components/panes/ResultPane.svelte';
	import CustomRadixPane from '$lib/components/panes/CustomRadixPane.svelte';

	let colors: ColorRecord[] = $state(JSON.parse(local['color-palette'] ?? '[]'));

	$effect(() => {
		local['color-palette'] = JSON.stringify(colors);
	});
</script>

<svelte:head>
	<title>Build your own palette</title>
	<meta name="description" content="A tool to build your own color palette." />
</svelte:head>

{#snippet render_tab(key: string, Com: Component)}
	<Tabs.Content value={key} class="h-0 w-full grow">
		<Card.Root class="h-full w-full overflow-auto py-0">
			<Card.Content class="h-full w-full overflow-hidden p-0 py-0">
				<div class="h-full w-full overflow-auto p-6">
					<Com />
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
{/snippet}

{#if !import.meta.env.SSR}
	<div class="h-dvh w-screen">
		<Resizable.PaneGroup direction="horizontal" autoSaveId="main-pane">
			<Resizable.Pane class="min-w-96">
				<Resizable.PaneGroup direction="vertical" autoSaveId="color-pane">
					<Resizable.Pane class="min-h-48 p-2">
						<Tabs.Root
							class="h-full w-full"
							bind:value={() => local['color-tab'] ?? 'tw', (val) => (local['color-tab'] = val)}
						>
							<Tabs.List class="w-full">
								<Tabs.Trigger value="tw">Tailwind</Tabs.Trigger>
								<Tabs.Trigger value="rd">Radix</Tabs.Trigger>
							</Tabs.List>
							{@render render_tab('tw', TailwindTab)}
							{@render render_tab('rd', RadixTab)}
						</Tabs.Root>
					</Resizable.Pane>
					<Resizable.Handle withHandle />
					<Resizable.Pane class="min-h-48 p-2">
						<CustomRadixPane />
					</Resizable.Pane>
				</Resizable.PaneGroup>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane class="min-w-96">
				<Resizable.PaneGroup direction="vertical" autoSaveId="generator-pane">
					<Resizable.Pane class="relative min-h-48">
						<EditorPane bind:colors />
					</Resizable.Pane>
					<Resizable.Handle withHandle />
					<Resizable.Pane class="min-h-48 p-2">
						<ResultPane {colors} />
					</Resizable.Pane>
				</Resizable.PaneGroup>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>
{/if}

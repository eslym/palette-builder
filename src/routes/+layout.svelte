<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	const dark = new MediaQuery('(prefers-color-scheme: dark)');

	if (!import.meta.env.SSR) {
		$effect.pre(() => {
			if (dark.current) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});
	}
</script>

<Toaster theme={dark.current ? 'dark' : 'light'} />

{@render children()}

<script lang="ts">
	import Color from 'colorjs.io';

	let { color = $bindable(), droppable = false }: { color: string; droppable?: boolean } = $props();

	let events = $derived(
		droppable
			? {
					ondragenter(e: DragEvent) {
						e.preventDefault();
					},
					ondragover(e: DragEvent) {
						e.preventDefault();
						if (!e.dataTransfer) return;
						e.dataTransfer.dropEffect = 'copy';
						e.dataTransfer.effectAllowed = 'copy';
					},
					ondrop(e: DragEvent) {
						e.preventDefault();
						if (!e.dataTransfer || !e.dataTransfer.getData('text/plain')) return;
						const data = e.dataTransfer.getData('text/plain');
						try {
							e.dataTransfer.dropEffect = 'copy';
							new Color(data);
							color = data;
						} catch {}
					}
				}
			: {}
	);
</script>

<div
	class="border-border checkerboard size-9 min-w-9 overflow-hidden rounded-md border-1"
	{...events}
>
	<div class="h-full w-full" style:background-color={color}></div>
</div>

<style>
	.checkerboard {
		background: repeating-conic-gradient(#fff 0% 25%, #000 0% 50%, #fff 0% 75%, #000 0% 100%);
		background-size: 100% 100%;
		background-clip: padding-box;
	}
</style>

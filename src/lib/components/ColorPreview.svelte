<script lang="ts">
	let { color }: { color: string } = $props();
</script>

<div class="border-border checkerboard size-9 min-w-9 overflow-hidden rounded-md border-1">
	<div class="h-full w-full" style:background-color={color}></div>
</div>

<style>
	.checkerboard {
		background: repeating-conic-gradient(#fff 0% 25%, #000 0% 50%, #fff 0% 75%, #000 0% 100%);
		background-size: 100% 100%;
		background-clip: padding-box;
	}
</style>

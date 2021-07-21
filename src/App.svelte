<script lang="ts">
	import Pane from "./components/Pane.svelte";
	import { SplitType } from "./models/splitType";
	import { GridService } from "./services/gridService";
	import { PaneService } from "./services/paneService";
	const paneService = new PaneService();
	const gridService = new GridService(paneService);

	$: update = {};
</script>

<main>
	{#each paneService.panes as pane}
		<Pane
			command={pane.content}
			style={gridService.getGridStylesForPane(pane)}
			on:splitHorizontal={() => {paneService.splitPane(pane, SplitType.Horizontal); update ={}}}
			on:splitVertical={() => {paneService.splitPane(pane, SplitType.Vertical); update = {}}} />
	{/each}
</main>

<style>
	main {
		max-width: 240px;
		display: grid;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

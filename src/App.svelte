<script lang="ts">
	import Pane from "./components/Pane.svelte";
	import { SplitType } from "./models/splitType";
import { CommandService } from "./services/commandService";
	import { GridService } from "./services/gridService";
	import { PaneService } from "./services/paneService";
	const paneService = new PaneService();
	const gridService = new GridService(paneService);
	const commandService = new CommandService(paneService);

	$: update = {};
</script>

<main style={gridService.getGridStylesForContainer(update)}>
	{#each paneService.panes as pane}
		<Pane
			pane={pane}
			style={gridService.getGridStylesForPane(pane, update)}
			on:input={() => update = {}}
			on:splitHorizontal={() => {
				paneService.splitPane(pane, SplitType.Horizontal);
				update = {};
			}}
			on:splitVertical={() => {
				paneService.splitPane(pane, SplitType.Vertical);
				update = {};
			}}
		/>
	{/each}
</main>
<p>{commandService.getCommandText(update)}</p>

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

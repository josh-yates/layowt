<script lang="ts">
	import Pane from "./components/Pane.svelte";
	import { SplitType } from "./models/splitType";
	import { CommandService } from "./services/commandService";
	import { GridService } from "./services/gridService";
	import { TreeNodeStore } from "./services/treeNodeStore";
	import { UIService } from "./services/uiService";

	const nodeStore = new TreeNodeStore();
	const gridService = new GridService(nodeStore);
	const commandService = new CommandService(nodeStore);
	const uiService = new UIService(gridService, commandService);
	$: update = {};
</script>

<main style={uiService.getContainerGridStyles(update)}>
	{#each nodeStore.nodes as pane}
		<Pane
			{pane}
			style={uiService.getPaneGridStyles(pane, update)}
			on:input={() => (update = {})}
			on:splitHorizontal={() => {
				nodeStore.split(pane, SplitType.Horizontal);
				update = {};
			}}
			on:splitVertical={() => {
				nodeStore.split(pane, SplitType.Vertical);
				update = {};
			}}
		/>
	{/each}
</main>
<p class="command">{uiService.getCommandText(update)}</p>

<style>
	main {
		width: 80%;
		margin-top: 1rem;
		flex-grow: 1;
		flex-shrink: 0;
		display: grid;
		background-color: var(--fg-colour);
		column-gap: 2px;
		row-gap: 2px;
		border: 2px solid var(--fg-colour);
		border-radius: 0.5rem;
		overflow: hidden;
		min-height: 0;
		min-width: 0;
	}

	.command {
		width: 80%;
		flex-shrink: 0;
		height: 3rem;
		padding: 1rem 1rem;
		background-color: var(--bg-colour__secondary);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		font-weight: 900;
		margin: 1rem 0;
		border-radius: 0.5rem;
		overflow: hidden;
		white-space: nowrap;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

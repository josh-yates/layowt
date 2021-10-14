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

	let showCopied = false;

	const copyCommand = () => {
		const command = uiService.getCommandText(null);

		navigator.clipboard.writeText(command);

		showCopied = true;

		window.setTimeout(() => (showCopied = false), 2000);
	};
</script>

<header>
	<a class="title" href="/">layowt</a>
	<a
		class="github-link"
		href="https://github.com/josh-yates/layowt"
		target="_blank">View GitHub repository</a
	>
</header>
<main style={uiService.getContainerGridStyles(update)}>
	{#each nodeStore.nodes as pane, i}
		<Pane
			{pane}
			index={i}
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
			on:remove={() => {
				nodeStore.remove(pane);
				update = {};
			}}
		/>
	{/each}
</main>
<p class="command">
	{uiService.getCommandText(update)}<button
		class="copy-button"
		on:click={copyCommand}>{showCopied ? "Copied!" : "Copy"}</button
	>
</p>

<style>
	:root {
		--header-font-size: 1.5rem;
		--header-padding: 1rem;
		--content-width: 80%;
		--command-font-size: 1rem;
	}

	header {
		height: calc(var(--header-font-size) + 2 * var(--header-padding));
		width: var(--content-width);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		padding: var(--header-padding) 0;
		flex-shrink: 0;
		flex-grow: 0;
	}

	header .title {
		color: var(--fg-colour);
		font-size: var(--header-font-size);
		line-height: var(--header-font-size);
		font-weight: 900;
		text-decoration: none;
	}

	header .title:visited {
		color: var(--fg-colour);
		text-decoration: none;
	}

	header .github-link {
		margin-left: auto;
		height: var(--header-font-size);
		width: var(--header-font-size);
		background-image: url(./../resources/github.svg);
		font-size: 0;
		line-height: 0;
	}

	main {
		width: var(--content-width);
		flex-grow: 1;
		flex-shrink: 1;
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
		width: var(--content-width);
		flex-shrink: 0;
		flex-grow: 0;
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
		position: relative;
	}

	.copy-button {
		position: absolute;
		right: 0.5rem;
		padding: 0.5rem;
		line-height: var(--command-font-size);
		border-radius: 0.5rem;
		background-color: var(--bg-colour__secondary);
		border: 2px solid var(--fg-colour);
		font-size: var(--command-font-size);
		font-weight: 900;
		font-family: monospace;
		color: var(--fg-colour);
		box-shadow: 0px 0px 1rem 2rem var(--bg-colour__secondary);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

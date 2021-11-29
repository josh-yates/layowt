<script lang="ts">
	import Pane from "./components/Pane.svelte";
	import { Layout } from "./models/layout";
	import { SplitType } from "./models/splitType";
	import { CommandService } from "./services/commandService";
	import { GridService } from "./services/gridService";
	import { LocalStorageService } from "./services/localStorageService";
	import { PaneService } from "./services/paneService";
	import { TabService } from "./services/tabService";
	import { UIService } from "./services/uiService";

	const paneService = new PaneService();
	const gridService = new GridService(paneService);
	const tabService = new TabService();
	const commandService = new CommandService(paneService);
	const uiService = new UIService(gridService, commandService);
	const localStorageService = new LocalStorageService(paneService);

	const layout = localStorageService.retrieveLayout() ?? new Layout();

	let currentTab = layout.tabs[0];

	$: update = {};
	$: canRemovePane = !!update && currentTab.panes.length !== 1;
	$: canRemoveTab = !!update && layout.tabs.length !== 1;
	$: {
		update;
		localStorageService.saveLayout(layout);
	}

	let showCopied = false;

	const copyCommand = () => {
		const command = uiService.getCommandText(layout, null);

		navigator.clipboard.writeText(command);

		showCopied = true;

		window.setTimeout(() => (showCopied = false), 2000);
	};
</script>

<header>
	<h1 class="title">layowt</h1>
	<a
		class="github-link"
		href="https://github.com/josh-yates/layowt"
		target="_blank">View GitHub repository</a
	>
</header>
<aside class="tabs">
	{#each layout.tabs as tab, i}
		<button
			title={`${tab.title} (${i})`}
			class="tab"
			data-selected={currentTab === tab}
			on:click={() => (currentTab = tab)}>{`${tab.title} (${i})`}</button
		>
	{/each}
	{#if canRemoveTab}
		<button
			class="tab remove"
			on:click={() => {
				const indexOfOldCurrentTab = layout.tabs.indexOf(currentTab);
				tabService.remove(currentTab);
				update = {};
				const newCurrentTab =
					layout.tabs[
						Math.min(indexOfOldCurrentTab, layout.tabs.length - 1)
					];
				currentTab = newCurrentTab;
				layout.tabs = layout.tabs;
				currentTab.panes = currentTab.panes;
			}}>Remove</button
		>{/if}
	<button
		class="tab add"
		on:click={() => {
			tabService.add(layout);
			update = {};
			layout.tabs = layout.tabs;
			currentTab = layout.tabs[layout.tabs.length - 1];
		}}>Add</button
	>
</aside>
<main style={uiService.getContainerGridStyles(currentTab, update)}>
	{#each currentTab.panes as pane, i}
		<Pane
			{pane}
			canRemove={canRemovePane}
			index={i}
			style={uiService.getPaneGridStyles(pane, update)}
			on:input={() => (update = {})}
			on:splitHorizontal={() => {
				paneService.split(pane, SplitType.Horizontal);
				update = {};
			}}
			on:splitVertical={() => {
				paneService.split(pane, SplitType.Vertical);
				update = {};
			}}
			on:remove={() => {
				paneService.remove(pane);
				update = {};
				currentTab.panes = currentTab.panes;
			}}
		/>
	{/each}
</main>
<p class="command">
	{uiService.getCommandText(layout, update)}<button
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

	.copy-button,
	.tab {
		padding: 0.5rem;
		line-height: var(--command-font-size);
		border-radius: 0.5rem;
		border: 2px solid var(--fg-colour);
		font-size: var(--command-font-size);
		font-weight: 900;
		font-family: monospace;
		color: var(--fg-colour);
	}

	.copy-button {
		background-color: var(--bg-colour__secondary);
		position: absolute;
		right: 0.5rem;
		box-shadow: 0px 0px 1rem 2rem var(--bg-colour__secondary);
	}

	.tabs {
		padding: 0 1rem;
		width: var(--content-width);
		display: flex;
		align-items: center;
		justify-content: start;
		margin-bottom: -2px;
		z-index: 1;
		overflow-x: overlay;
		flex-shrink: 0;
		flex-grow: 0;
	}

	.tab {
		background-color: var(--bg-colour);
		position: relative;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		flex-shrink: 1;
		flex-grow: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tab:not(:first-child) {
		margin-left: -2px;
	}

	.tab.add {
		position: sticky;
		right: 0;
		margin-left: auto;
	}

	.tab.remove {
		margin-left: auto;
		position: sticky;
		right: 1rem;
	}

	.tab.remove + .tab.add {
		margin-left: unset;
	}

	.tab:nth-last-child(2) {
		margin-right: 0.5rem;
	}

	.tab[data-selected="true"],
	.tab.add,
	.tab.remove {
		flex-shrink: 0;
		border-bottom-color: var(--bg-colour);
		z-index: 1;
		overflow: visible;
	}

	.tab[data-selected="false"] {
		background-color: var(--bg-colour__secondary);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

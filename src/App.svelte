<script lang="ts">
	import Pane from "./components/Pane.svelte";
	import { Layout } from "./models/layout";
	import { SplitType } from "./models/splitType";
	import { CloningService } from "./services/cloningService";
	import { CommandService } from "./services/commandService";
	import { GridService } from "./services/gridService";
  	import { ImportService } from "./services/importService";
	import { JSONService } from "./services/jsonService";
	import { LocalStorageService } from "./services/localStorageService";
	import { PaneService } from "./services/paneService";
	import { TabService } from "./services/tabService";
	import { UIService } from "./services/uiService";

	const cloningService = new CloningService();
	const paneService = new PaneService(cloningService);
	const gridService = new GridService(paneService);
	const tabService = new TabService();
	const commandService = new CommandService(paneService);
	const uiService = new UIService(gridService, commandService);
	const jsonService = new JSONService(paneService);
	const localStorageService = new LocalStorageService(jsonService);
	const importService = new ImportService(
			(importedLayouts) => {
				importedLayouts.forEach(l => layouts.push(l));
				layouts = layouts;
				update = {};
				importingFile = false;
			},
			(errorMessage) => {
				alert(errorMessage);
				importingFile = false;
			},
			jsonService
		);

	let layouts = localStorageService.retrieveLayouts();

	let currentLayout = layouts[0];
	let currentTab = currentLayout.tabs[0];

	$: showLayoutListing = false;
	$: importingFile = false;

	$: update = {};
	$: canRemovePane = !!update && currentTab.panes.length !== 1;
	$: canRemoveTab = !!update && currentLayout.tabs.length !== 1;
	$: {
		update;
		localStorageService.saveLayouts(layouts);
	}

	$: {
		if (!showLayoutListing) {
			layouts.forEach((l) => (l.selected = false));
			update = {};
		}
	}

	let showCopied = false;

	const copyCommand = () => {
		const command = uiService.getCommandText(currentLayout, null);

		navigator.clipboard.writeText(command);

		showCopied = true;

		window.setTimeout(() => (showCopied = false), 2000);
	};

	const handleFileEvent = ($event: Event) => {
		const target = $event.target as HTMLInputElement;

		if (!target.files.length) return;

		importingFile = true;

		importService.import(target.files[0]);
	};
</script>

<header>
	<h1 class="title">layowt</h1>
	{#if !showLayoutListing}
		<input
			id="layout-title"
			name="layout-title"
			type="text"
			spellcheck="false"
			placeholder="No title"
			bind:value={currentLayout.title}
			on:input={() => (update = {})}
		/>
		<button id="more-layouts" on:click={() => (showLayoutListing = true)}
			>More</button
		>
	{/if}
	<a
		class="github-link"
		data-with-title={!showLayoutListing}
		href="https://github.com/josh-yates/layowt"
		target="_blank">View GitHub repository</a
	>
</header>
{#if showLayoutListing}
	<main class="layout-listing">
		<h2>Your layowts</h2>
		<ul>
			{#each layouts as layout, i}
				<li data-no-title={!layout.title}>
					<button
						class="layout-open"
						on:click={() => {
							currentLayout = layout;
							currentLayout.tabs = currentLayout.tabs;
							currentTab = currentLayout.tabs[0];
							showLayoutListing = false;
						}}>{!!layout.title ? layout.title : "No title"}</button
					>
					<div
						class="checkbox-container"
						data-checked={layout.selected}
					>
						<input
							id="layowtSelect-{i}"
							name="layowtSelect-{i}"
							type="checkbox"
							bind:checked={layout.selected}
							on:change={() => (update = {})}
						/>
						<label for="layowtSelect-{i}" />
					</div>
				</li>
			{/each}
		</ul>
		<div class="layout-buttons">
			<button
				on:click={() => {
					const newLayout = new Layout();
					layouts.push(newLayout);
					update = update;
					currentLayout = newLayout;
					currentLayout.tabs = currentLayout.tabs;
					currentTab = currentLayout.tabs[0];
					showLayoutListing = false;
				}}>New layowt</button
			>
			
			<label>
				<input disabled="{importingFile}" type="file" accept=".layowt" on:change="{($event) => handleFileEvent($event)}">
				Import
			</label>
			{#if layouts.filter((l) => l.selected).length > 1}
				<button
					on:click={() => {
						const layoutsToMerge = layouts.filter(
							(l) => l.selected
						);

						const primaryLayout = layoutsToMerge.shift();

						layoutsToMerge.forEach((l) => {
							l.tabs.forEach((t) => (t.layout = primaryLayout));
							primaryLayout.tabs.push(...l.tabs);
							layouts.splice(layouts.indexOf(l), 1);
						});

						primaryLayout.title = [
							primaryLayout.title,
							...layoutsToMerge.map((l) => l.title),
						]
							.filter((t) => !!t)
							.join(" / ");

						layouts.forEach((l) => (l.selected = false));

						update = {};
						layouts = layouts;
					}}>Merge</button
				>
			{/if}
			{#if layouts.filter((l) => l.selected).length === 1}
			<!-- svelte-ignore missing-declaration -->
			<button on:click={() => {
				const layoutToSave = layouts.filter((l) => l.selected)[0];
				const jsonToSave = jsonService.layoutsToJSON([layoutToSave]);
				const blob = new Blob([jsonToSave], {type: 'application/json'});
				const url = URL.createObjectURL(blob);

				const downloadElement = document.createElement('a');

				downloadElement.download = `${layoutToSave.title?.trim().length ? layoutToSave.title.trim() : 'Untitled'}.layowt`;
				downloadElement.href = url;
				downloadElement.click();

				downloadElement.remove();
			}}>Export</button>
			{/if}
			{#if layouts.filter((l) => l.selected).length}
				<button
					on:click={() => {
						const layoutsToClone = layouts.filter(
							(l) => l.selected
						);

						layouts.push(
							...layoutsToClone.map((l) =>
								cloningService.cloneLayout(l)
							)
						);

						layouts.forEach((l) => (l.selected = false));

						update = {};
						layouts = layouts;
					}}>Clone</button
				>
				<button
					on:click={() => {
						layouts
							.filter((l) => l.selected)
							.forEach((l) =>
								layouts.splice(layouts.indexOf(l), 1)
							);

						update = {};
						if (!layouts.length) {
							layouts.push(new Layout());
							currentLayout = layouts[0];
							currentTab = currentLayout.tabs[0];
							showLayoutListing = false;
						}
						layouts = layouts;
					}}>Remove</button
				>
			{/if}
		</div>
	</main>
{:else}
	<aside class="tabs">
		{#each currentLayout.tabs as tab, i}
			<button
				title={`${tab.title} (${i})`}
				class="tab"
				data-selected={currentTab === tab}
				on:click={() => (currentTab = tab)}
				>{`${tab.title} (${i})`}</button
			>
		{/each}
		<button
			class="tab clone"
			on:click={() => {
				const newTab = cloningService.cloneTab(currentTab);
				currentLayout.tabs.push(newTab);
				currentTab = newTab;

				update = {};
				currentLayout.tabs = currentLayout.tabs;
			}}>Clone</button
		>
		{#if canRemoveTab}
			<button
				class="tab remove"
				on:click={() => {
					const indexOfOldCurrentTab =
						currentLayout.tabs.indexOf(currentTab);
					tabService.remove(currentTab);
					update = {};
					const newCurrentTab =
						currentLayout.tabs[
							Math.min(
								indexOfOldCurrentTab,
								currentLayout.tabs.length - 1
							)
						];
					currentTab = newCurrentTab;
					currentLayout.tabs = currentLayout.tabs;
					currentTab.panes = currentTab.panes;
				}}>Remove</button
			>{/if}
		<button
			class="tab add"
			on:click={() => {
				tabService.add(currentLayout);
				update = {};
				currentLayout.tabs = currentLayout.tabs;
				currentTab = currentLayout.tabs[currentLayout.tabs.length - 1];
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
		{uiService.getCommandText(currentLayout, update)}<button
			class="copy-button"
			on:click={copyCommand}>{showCopied ? "Copied!" : "Copy"}</button
		>
	</p>
{/if}

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
		margin-right: 0.5rem;
	}

	header .title:visited {
		color: var(--fg-colour);
		text-decoration: none;
	}

	header .github-link {
		height: var(--header-font-size);
		width: var(--header-font-size);
		background-image: url(./../resources/github.svg);
		font-size: 0;
		line-height: 0;
		flex-shrink: 0;
		flex-grow: 0;
		margin-left: 0.5rem;
	}

	.github-link[data-with-title="false"] {
		margin-left: auto;
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

	.layout-listing {
		background-color: var(--bg-colour);
		border: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		font-size: 1rem;
		font-family: monospace;
		font-weight: 900;
		overflow-y: auto;
	}

	.layout-listing > h2 {
		margin: 0;
	}

	.layout-listing > ul {
		width: 80%;
		max-width: 30rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: start;
		padding: 0;
		margin: 1rem 0 0 0;
	}

	.layout-listing > ul > li {
		list-style-type: none;
		margin: 0;
		border: 2px solid var(--fg-colour);
		border-bottom: none;
		padding: 0;
		overflow: hidden;
		position: relative;
		height: 3.25rem;
		display: flex;
		align-items: center;
	}

	.layout-listing > ul > li:first-child {
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}

	.layout-listing > ul > li:last-child {
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		border-bottom: 2px solid var(--fg-colour);
	}

	.layout-listing li > .layout-open {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		font-size: 1rem;
		font-weight: 900;
		line-height: 1rem;
		font-family: monospace;
		color: var(--fg-colour);
		background: var(--bg-colour);
		border: none;
		padding: 0.5rem;
	}

	.layout-listing li[data-no-title="true"] > .layout-open {
		color: var(--fg-colour__secondary);
	}

	.layout-listing li > .checkbox-container {
		position: absolute;
		height: 2.4375rem;
		width: 2.4375rem;
		margin: 0;
		right: unset;
		left: 100%;
		box-shadow: 0px 0px 1rem 2rem var(--bg-colour);
	}

	.checkbox-container > input[type="checkbox"] {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkbox-container > label {
		position: relative;
		display: block;
		height: 100%;
		width: 100%;
		background-color: var(--bg-colour);
		border: 0.125rem solid var(--fg-colour);
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.checkbox-container > input[type="checkbox"]:checked + label::after {
		content: "";
		position: absolute;
		height: 1.9375rem;
		width: 1.9375rem;
		background-color: var(--fg-colour);
		border-radius: 0.25rem;
		top: 0.125rem;
		left: 0.125rem;
	}

	.layout-listing > ul > li:hover > .checkbox-container,
	.layout-listing > ul > li:focus-within > .checkbox-container,
	.layout-listing li > .checkbox-container[data-checked="true"] {
		left: unset;
		right: 0.5rem;
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
	.tab,
	.layout-buttons > button,
	.layout-buttons > label,
	#more-layouts {
		padding: 0.5rem;
		line-height: var(--command-font-size);
		border-radius: 0.5rem;
		border: 2px solid var(--fg-colour);
		font-size: var(--command-font-size);
		font-weight: 900;
		font-family: monospace;
		color: var(--fg-colour);
	}

	.layout-buttons {
		display: flex;
		align-items: center;
		justify-content: start;
		margin: 1rem 0 0.5rem 0;
		position: sticky;
		bottom: 0.5rem;
		width: 80%;
		max-width: 30rem;
		overflow-x: auto;
		box-shadow: 0px 0px 1rem 0.5rem var(--bg-colour);
		background-color: var(--bg-colour);
		flex-shrink: 0;
	}

	.layout-buttons > button,
	.layout-buttons > label {
		flex-shrink: 0;
		flex-grow: 0;
	}

	.layout-buttons > label {
		cursor: pointer;
	}

	.layout-buttons > label > input {
		display: none;
	}

	.layout-buttons > :not(:last-child) {
		margin-right: 0.5rem;
	}

	.layout-buttons > :nth-child(3) {
		margin-left: auto;
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

	.tab.clone {
		margin-left: auto;
		position: sticky;
		right: 3.5rem;
		margin-right: 0.5rem;
	}

	.tab.remove {
		position: sticky;
		right: 1rem;
		margin-left: 0;
	}

	.tab.remove + .tab.add,
	.tab.clone + .tab.add {
		margin-left: unset;
	}

	.tab:nth-last-child(2) {
		margin-right: 0.5rem;
	}

	.tab[data-selected="true"],
	.tab.add,
	.tab.remove,
	.tab.clone {
		flex-shrink: 0;
		border-bottom-color: var(--bg-colour);
		z-index: 1;
		overflow: visible;
		position: sticky;
		left: 0;
	}

	.tab[data-selected="false"] {
		background-color: var(--bg-colour__secondary);
	}

	#layout-title {
		margin-left: auto;
		margin-right: 0.5rem;
		flex-shrink: 1;
		flex-grow: 1;
		min-width: 0;
		max-width: 20rem;
	}

	#more-layouts {
		flex-grow: 0;
		flex-shrink: 0;
		margin-right: auto;
	}

	input[type="text"] {
		font-weight: 900;
		font-size: 1rem;
		line-height: 1rem;
		font-family: monospace;
		padding: 0.5rem;
		background-color: var(--bg-colour);
		border: 0.125rem solid var(--fg-colour);
		border-radius: 0.5rem;
		color: var(--fg-colour);
	}

	input[type="text"]:focus {
		outline: none;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

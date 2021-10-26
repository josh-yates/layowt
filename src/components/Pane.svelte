<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Pane } from "../models/pane";
    export let pane: Pane;
    export let style: string;
    export let index: number;
    export let canRemove: boolean;
    const dispatch = createEventDispatcher();
    const splitVertical = () => dispatch("splitVertical");
    const splitHorizontal = () => dispatch("splitHorizontal");
    const input = () => dispatch("input");
    const remove = () => {
        showOptions = false;
        dispatch("remove");
    };

    let showOptions = false;
</script>

<div class="pane" {style}>
    {#if showOptions}
        <form
            class="menu-form"
            on:submit={(e) => {
                showOptions = false;
                e.preventDefault();
            }}
        >
            <div class="form-content">
                <div class="form-row">
                    <label for="directory-{index}">Directory</label>
                    <input
                        id="directory-{index}"
                        name="directory-{index}"
                        type="text"
                        spellcheck="false"
                        placeholder="eg. C:\Path\To\Your\App"
                        bind:value={pane.directory}
                        on:input={input}
                    />
                </div>
                <div class="form-row">
                    <label for="title-{index}">Title</label>
                    <input
                        id="title-{index}"
                        name="title-{index}"
                        type="text"
                        spellcheck="false"
                        placeholder="eg. My awesome app"
                        bind:value={pane.title}
                        on:input={input}
                    />
                </div>
                <div class="form-row">
                    <label for="persisttitle-{index}">Persist title</label>
                    <div class="checkbox-container">
                        <input
                            id="persisttitle-{index}"
                            name="persisttitle-{index}"
                            type="checkbox"
                            bind:checked={pane.persistTitle}
                            on:change={input}
                        />
                        <label for="persisttitle-{index}" />
                    </div>
                </div>
                <div class="form-row">
                    <label for="colourScheme-{index}">Colour scheme</label>
                    <input
                        id="colourScheme-{index}"
                        name="colourScheme-{index}"
                        type="text"
                        spellcheck="false"
                        placeholder="eg. Gruvbox Dark"
                        bind:value={pane.colourScheme}
                        on:input={input}
                    />
                </div>
                <!-- TODO: Fix issues with Tab Colour?-->
                <!-- <div class="form-row">
                    <label for="colour-{index}">Tab colour</label>
                    <div class="colour-container">
                        <input
                            id="colour-{index}"
                            name="colour-{index}"
                            type="color"
                            spellcheck="false"
                            placeholder="eg. #48476a"
                            bind:value={pane.tabColour}
                            on:input={input}
                        />
                        <label
                            for="colour-{index}"
                            style="--swatch-colour: {pane.tabColour}"
                        />
                    </div>
                </div> -->
            </div>
            <div class="form-buttons">
                <button type="submit" class="form-button">OK</button>
                {#if canRemove}
                    <button
                        type="button"
                        class="form-button remove"
                        on:click={remove}>Remove</button
                    >
                {/if}
            </div>
        </form>
    {:else}
        <div class="command-holder">
            <textarea
                placeholder="Type your commands here. Use the buttons to the right and bottom to split panes."
                spellcheck="false"
                class="command-input"
                bind:value={pane.content}
                on:input={input}
            />
        </div>
        <button class="split vertical" on:click={splitVertical}
            >Split vertical</button
        >
        <button class="split horizontal" on:click={splitHorizontal}
            >Split horizontal</button
        >
        <button class="menu-button" on:click={() => (showOptions = true)}
            >More</button
        >
    {/if}
</div>

<style>
    .pane {
        background-color: var(--bg-colour);
        --button-thickness: 1.25rem;
        display: grid;
        position: relative;
        grid-template-columns: auto var(--button-thickness);
        grid-template-rows: auto var(--button-thickness);
        overflow: auto;
        min-height: 0;
        min-width: 0;
    }

    .menu-button {
        opacity: 0;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        background-color: var(--bg-colour);
        height: 2rem;
        line-height: 1rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.125rem solid var(--fg-colour);
        border-radius: 0.5rem;
        font-weight: 900;
        font-size: 1rem;
        color: var(--fg-colour);
        font-family: monospace;
        box-shadow: 0px 0px 1rem 1rem var(--bg-colour);
    }

    .menu-button:hover,
    .menu-button:focus-visible,
    .pane:focus-within > .menu-button {
        opacity: 1;
    }

    .command-holder {
        padding: 0.5rem 0 0 0.5rem;
        grid-row: 1;
        grid-column: 1;
    }

    .command-input {
        resize: none;
        height: 100%;
        width: 100%;
        border: none;
        background-color: transparent;
        outline: none;
        font-size: 1rem;
        font-weight: 900;
        color: var(--fg-colour);
    }

    .command-input:focus {
        border: none;
        outline: none;
    }

    button.split {
        font-size: 0;
        opacity: 0;
        border: none;
        background-color: var(--fg-colour__secondary);
    }

    button.split:hover,
    button.split:focus-visible {
        opacity: 1;
    }

    button.split.vertical {
        margin-top: 3rem;
        grid-row: 1;
        grid-column: 2;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        z-index: 1;
    }

    button.split.horizontal {
        grid-row: 2;
        grid-column: 1;
        margin-left: 1rem;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }

    .menu-form {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        grid-column: span 2;
        grid-row: span 2;
        padding: 0.5rem;
    }

    .form-buttons {
        display: flex;
        flex-direction: row;
        margin-top: 0.5rem;
    }

    .form-button {
        background-color: var(--bg-colour);
        height: 2rem;
        line-height: 1rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.125rem solid var(--fg-colour);
        border-radius: 0.5rem;
        font-weight: 900;
        font-size: 1rem;
        color: var(--fg-colour);
        font-family: monospace;
    }

    .form-button.remove {
        margin-left: auto;
    }

    .form-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
    }

    .form-row:not(:first-child) {
        margin-top: 0.5rem;
    }

    .form-row > * {
        font-weight: 900;
        font-size: 1rem;
        line-height: 1rem;
        font-family: monospace;
    }

    .form-row > label {
        width: 30%;
        display: inline-block;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .form-row > input {
        flex-grow: 1;
        flex-shrink: 1;
        padding: 0.5rem;
        background-color: var(--bg-colour);
        border: 0.125rem solid var(--fg-colour);
        border-radius: 0.5rem;
        margin-left: 0.5rem;
        min-width: 0;
        font-size: 1rem;
        font-weight: 900;
        color: var(--fg-colour);
    }

    .form-row > input:focus {
        outline: none;
    }

    .form-row > .checkbox-container {
        position: relative;
        height: 2.4375rem;
        width: 2.4375rem;
        margin-right: auto;
        margin-left: 0.5rem;
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

    /* .form-row > .colour-container {
        position: relative;
        height: 2.4375rem;
        width: 4.875rem;
        margin-right: auto;
        margin-left: 0.5rem;
    }

    .colour-container > input[type="color"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        bottom: 0;
        left: 0;
    }

    .colour-container > label {
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
        background-color: var(--bg-colour);
        border: 0.125rem solid var(--fg-colour);
        border-radius: 0.5rem;
        cursor: pointer;
        --swatch-colour: var(--bg-colour);
    }

    .colour-container > label::after {
        content: "";
        position: absolute;
        height: 1.9375rem;
        width: 4.375rem;
        background-color: var(--swatch-colour);
        border-radius: 0.25rem;
        top: 0.125rem;
        left: 0.125rem;
    } */
</style>

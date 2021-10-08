<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { TreeNode } from "../models/treeNode";
    export let pane: TreeNode;
    export let style: string;
    const dispatch = createEventDispatcher();
    const splitVertical = () => dispatch("splitVertical");
    const splitHorizontal = () => dispatch("splitHorizontal");
    const input = () => dispatch("input");
    const remove = () => dispatch("remove");

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
                <label for="directory">Directory</label>
                <input
                    id="directory"
                    name="directory"
                    type="text"
                    spellcheck="false"
                />
            </div>
            <div class="form-buttons">
                <button type="submit" class="form-button">OK</button>
                <!--TODO: Fix issues with node removal-->
                <!-- <button
                    type="button"
                    class="form-button remove"
                    on:click={remove}>Remove</button
                > -->
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
        border: 2px solid var(--fg-colour);
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
    }

    .form-button {
        background-color: var(--bg-colour);
        height: 2rem;
        line-height: 1rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--fg-colour);
        border-radius: 0.5rem;
        font-weight: 900;
        font-size: 1rem;
        color: var(--fg-colour);
        font-family: monospace;
    }

    .form-button.remove {
        margin-left: auto;
    }
</style>

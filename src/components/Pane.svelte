<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { TreeNode } from "../models/treeNode";
    export let pane: TreeNode;
    export let style: string;
    const dispatch = createEventDispatcher();
    const splitVertical = () => dispatch("splitVertical");
    const splitHorizontal = () => dispatch("splitHorizontal");
    const input = () => dispatch("input");
</script>

<div class="pane" {style}>
    <div class="command-holder">
        <textarea
            class="command-input"
            bind:value={pane.content}
            on:input={input}
        />
    </div>
    <button class="vertical" on:click={splitVertical}>Split vertical</button>
    <button class="horizontal" on:click={splitHorizontal}
        >Split horizontal</button
    >
</div>

<style>
    .pane {
        background-color: var(--bg-colour);
        --button-thickness: 1.25rem;
        display: grid;
        grid-template-columns: auto var(--button-thickness);
        grid-template-rows: auto var(--button-thickness);
        overflow: auto;
        min-height: 0;
        min-width: 0;
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

    button {
        font-size: 0;
        opacity: 0;
        border: none;
        background-color: var(--fg-colour__secondary);
    }

    button:hover {
        opacity: 1;
    }

    button.vertical {
        margin-top: 1rem;
        grid-row: 1;
        grid-column: 2;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }

    button.horizontal {
        grid-row: 2;
        grid-column: 1;
        margin-left: 1rem;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
</style>

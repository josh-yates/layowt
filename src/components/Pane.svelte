<script lang="ts">
    import { createEventDispatcher } from "svelte";
import type { TreeNode } from "../models/treeNode";
    export let pane: TreeNode;
    export let style: string;
    const dispatch = createEventDispatcher();
    const splitVertical = () => dispatch("splitVertical");
    const splitHorizontal = () => dispatch("splitHorizontal");
    const input = () => dispatch('input');
</script>

<div class="pane" {style}>
    <div class="command-holder">
        <input on:input="{input}" bind:value={pane.content} />
    </div>
    <button class="vertical" on:click={splitVertical}>Split vertical</button>
    <button class="horizontal" on:click={splitHorizontal}
        >Split horizontal</button
    >
</div>

<style>
    .pane {
        --button-thickness: 20px;
        display: grid;
        grid-template-columns: auto var(--button-thickness);
        grid-template-rows: auto var(--button-thickness);
        border: 2px solid black;
        overflow: auto;
    }

    .command-holder {
        grid-row: 1;
        grid-column: 1;
    }

    button {
        font-size: 0;
    }

    button.vertical {
        grid-row: 1;
        grid-column: 2;
    }

    button.horizontal {
        grid-row: 2;
        grid-column: 1;
    }
</style>

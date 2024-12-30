<script lang="ts">
	import Block from "./block/Block.svelte";
	import {keyboardservice} from "../actions/keyboardservice.js";
	import {editorState} from "../states/base/EditorState.svelte.js";

</script>

<div class="page minimal-scrollbar" contenteditable use:keyboardservice>
	{#each editorState.blocks as block, i(block.key)}
		<Block block={block} index={i}/>
	{/each}
</div>

<style lang="scss">
	.page {
		overflow-y: scroll;
		min-height: 0;
		min-width: 0;
		width: 100%;
		background: var(--dark);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

		padding: 40px 0;
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
		border: 1px var(--line-color) solid;

		&:focus {
			outline: none;
		}

	}
</style>
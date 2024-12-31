<script lang="ts">
	import {sharedstate} from "../../actions/sharedstate.svelte.js";
	import {WordFormat, type WordState} from "../../states/WordState.svelte";

	let p: {
		word: WordState,
		block: number,
		index: number
	} = $props()

	let bold = $derived(p.word.format == WordFormat.Bold)
	let indexes = $derived([p.block, p.index])
</script>

<div class="word" class:bold>
	<div class="content" use:sharedstate="{indexes}">
		{p.word.value}
	</div>
</div>

<style lang="scss">
	.word {
		display: inline;
		white-space: pre-wrap;
		transition: 200ms;

		.content {
			display: inline;
		}

		&:hover {
			color: cadetblue;
		}

		&.bold {
			font-weight: 500;
			@supports (-moz-appearance: none) {
				font-weight: 700;
			}
		}

		&.italic {
			font-style: italic;
		}
	}
</style>
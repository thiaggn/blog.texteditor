<script lang="ts">
	import {sharedstate} from "../../actions/sharedstate.js";
	import {Reference} from "../../services/ReferenceService";
	import {WordFormat, type WordState} from "../../states/WordState.svelte";

	let p: {
		word: WordState,
		block: number,
		index: number
	} = $props()

	let state = $derived(new Reference(p.word, [p.block, p.index]))
	let bold = $derived(p.word.format == WordFormat.Bold)
</script>

<div class="word" class:bold>
	<div class="content" use:sharedstate="{state}">
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
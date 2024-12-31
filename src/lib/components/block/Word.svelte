<script lang="ts">
	import {sharedstate} from "../../actions/sharedstate.svelte.js";
	import {WordFormat, type WordState} from "../../states/WordState.svelte";
	import {Address} from "../../services/AdressingService";

	let p: {
		word: WordState,
		block: number,
		index: number
	} = $props()

	let bold = $derived(p.word.format == WordFormat.Bold)
	let indexes = $derived(new Address([p.block, p.index], p.word.key))
</script>

<div class="word" class:bold class:empty={p.word.empty} class:first={p.index===0}>
	<div class="content" use:sharedstate="{indexes}" id={p.word.key}>
		{#if !p.word.empty}
			{p.word.value}
		{:else}
			&ZeroWidthSpace;
		{/if}
	</div>
</div>

<style lang="scss">
	.word {
		display: inline;
		white-space: pre-wrap;

		@keyframes blink {
			from {
				transform: translateX(-50%) translateY(-100%);
				background: rgba(255, 255, 255, 0.4);
			}
			to {
				background: rgba(255, 255, 255, 0.2);
				transform: translateX(-50%) translateY(-25%);
			}
		}

		&.empty {
			position: relative;

			&:after {
				content: "";
				position: absolute;
				width: 6px;
				height: 6px;
				border-radius: 100%;
				background: rgba(255, 255, 0, 0.44);

				animation-name: blink;
				animation-duration: 500ms; /* Tempo total de cada ciclo */
				animation-iteration-count: infinite; /* Repetição infinita */
				animation-timing-function: ease-in-out;
				animation-direction: alternate;

			}
		}

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
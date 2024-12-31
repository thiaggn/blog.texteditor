<script lang="ts">
	import Word from "./Word.svelte";
	import type {ParagraphState} from "../../states/ParagraphState.svelte";

	let p: { paragraph: ParagraphState, index: number } = $props()
</script>

<div class="text" id={p.paragraph.key}>
	{#each p.paragraph.words as word, i (word.key)}
		<Word word={word} block={p.index} index={i}/>
	{/each}
</div>

<style lang="scss">
	.text {
		line-height: 2.4rem;
		position: relative;
		min-height: 2.4rem;
		min-width: 20px;

	}
</style>
<script lang="ts">
	import Title from "./Title.svelte";
	import Paragraph from "./Paragraph.svelte";
	import {TitleState} from "../../states/TitleState.svelte";
	import {ParagraphState} from "../../states/ParagraphState.svelte";
	import type {State} from "../../states/base/State";
	let p: { block: State, index: number } = $props()
</script>

<div class="block" role="none">
	<div class="content">
		{#if p.block instanceof TitleState}
			<Title title={p.block} index={p.index}/>
		{:else if p.block instanceof ParagraphState}
			<Paragraph paragraph={p.block} index={p.index}/>
		{/if}
	</div>
</div>

<style lang="scss">
	.block {
		position: relative;
		display: flex;


		&:hover {
			outline: 1px solid rgba(255, 255, 255, 0.2);
		}

		.menu {
			position: absolute;
			flex-shrink: 0;
			width: 40px;
			display: flex;
			justify-content: center;
		}

		.content {
			padding: 0 4px;
			margin: 0 40px;
			transition: 200ms;
			border-radius: 4px;
		}
	}
</style>


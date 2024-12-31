<script lang="ts">
	import {sharedstate} from "../../actions/sharedstate.svelte.js";
	import type {TitleState} from "../../states/TitleState.svelte";

	let p: {title: TitleState, index: number} = $props()
	let indexes = $derived([p.index])

</script>

<div class="title">
	<div class="content" use:sharedstate="{indexes}">
		{p.title.value}
	</div>
</div>

<style lang="scss">
	.title {
		font-family: "Bellefair", serif;
		font-size: 2.6rem;
		padding: 2rem 0 0.8rem;
		position: relative;

		.content {
			min-width: 4px;
			min-height: 3rem;

		}
	}
</style>
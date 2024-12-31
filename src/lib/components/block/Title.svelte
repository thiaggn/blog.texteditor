<script lang="ts">
	import {sharedstate} from "../../actions/sharedstate.svelte.js";
	import type {TitleState} from "../../states/TitleState.svelte";
	import {Address} from "../../services/AdressingService";

	let p: {title: TitleState, index: number} = $props()
	let indexes = $derived(new Address([p.index], p.title.key))
	let first = p.index == 0

</script>

<div class="title" class:first id={p.title.key}>
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

		&.first {
			padding-top: 0;
		}

		.content {
			min-width: 4px;
			min-height: 3rem;

		}
	}
</style>
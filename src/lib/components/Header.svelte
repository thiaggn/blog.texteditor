<script lang="ts">
	import Icon from "./Icon.svelte";
	import {editorState} from "../states/EditorState.svelte.js";

</script>

<div class="header">
	<div></div>
	<div class="title">
		<Icon name="text_fields"/>
		<div class="value" contenteditable bind:innerText={editorState.title} spellcheck="false"></div>
	</div>
	<div class="list">
		<div class="option">
			<Icon name="publish"/>
			<button class="publish" aria-label="Publicar">Publicar</button>
		</div>
		<div class="option">
			<Icon name="delete"/>
			<button class="discard" aria-label="Descartar">Descartar</button>
		</div>
	</div>
</div>

<style lang="scss">
	.header {
		min-height: 0;
		min-width: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 15px;

		.title {
			display: flex;
			align-items: center;
			gap: 4px;
			width: 100%;

			.value {
				font-weight: 500;


				&:focus {
					outline: none;
				}
			}
		}

		.list {
			display: flex;
			gap: 16px;

			.option {
				display: flex;
			}
		}

	}
</style>
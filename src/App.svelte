<script lang="ts">
	import Header from "./lib/components/Header.svelte";
	import Editor from "./lib/components/Editor.svelte";
</script>

<div class="app">
	<main>
		<Header/>
		<Editor/>
	</main>
</div>

<style lang="scss">
	.app {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 30px;

		main {
			display: grid;
			max-width: 720px;
			width: 100%;
			height: 100vh;
			grid-template-rows: 70px 1fr;
			grid-template-columns: 1fr;
		}
	}
</style>

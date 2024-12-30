<script lang="ts">
	export let name: string;
	export let fill: number = 0;
	export let weight: number = 400;
	export let optical: number = 24;
	export let grad: number = 0;
	export let color: string = "var(--light)";
	export let size: number = 24;
	export let transition = 0;
</script>

<div class="icon" style:--fill={fill}
	 contenteditable={false}
	 style:--weight={weight}
	 style:--optical={optical}
	 style:--grad={grad}
	 style:--transition={transition + 'ms'}
	 style="font-size: {size}px; color:{color}">
	{name}
</div>

<style>
	@font-face {
		font-family: 'Material Symbols Outlined';
		font-style: normal;
		font-weight: 100 700;
		src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v212/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsI.woff2) format('woff2');
	}

	.icon {
		user-select: none;
		font-family: 'Material Symbols Outlined', sans-serif;
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		transition: var(--transition);

		font-variation-settings: 'FILL' var(--fill),
		'wght' var(--weight),
		'GRAD' var(--grad),
		'opsz' var(--optical)
	}
</style>
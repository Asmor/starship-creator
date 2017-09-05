<script>
export default {
	name: "singleItem",
	props: ["noRollover", "title"],
}
</script>

<template>
	<div
		class="single-item"
		:class="{ 'single-item__with-rollover': !noRollover }"
	>
		<div class="single-item--title">{{ title }}</div>
		<slot></slot>
	</div>
</template>

<style lang="scss">
.single-item {
	border: 2px solid #000;
	height: 100%;
	padding: 5px;

	&.single-item__with-rollover {
		cursor: pointer;

		&:hover {
			background: #ddd;
		}
	}

	.single-item--title {
		font-weight: bold;
		text-transform: uppercase;
	}
}
</style>

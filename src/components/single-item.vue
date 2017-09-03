<script>
export default {
	name: "singleItem",
	props: ["title"],
}
</script>

<template>
	<div class="single-item">
		<div class="single-item--title">{{ title }}</div>
		<slot></slot>
	</div>
</template>

<style lang="scss">
.single-item {
	border: 2px solid #000;
	cursor: pointer;
	height: 100%;
	padding: 5px;

	&:hover {
		background: #ddd;
	}

	.single-item--title {
		font-weight: bold;
		text-transform: uppercase;
	}
}
</style>

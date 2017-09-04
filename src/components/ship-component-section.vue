<script>
	export default {
		name: "shipComponentSection",
		props: ["title"],
	}
</script>

<template>
	<div class="ship-component-section">
		<div class="ship-component-section--title">
			{{ title }}
		</div>
		<div class="ship-component-section--content">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss">
.ship-component-section {
	.ship-component-section--title {
		padding-left: 10px;
		font-size: 24px;
		font-weight: bold;
	}
}
</style>

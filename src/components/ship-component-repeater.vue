<script>
	import singleSelector from "./single-selector.vue";

	export default {
		name: "shipComponentRepeater",
		props: ["components"],
		components: {
			singleSelector
		},
	}
</script>

<template>
	<div class="ship-component-repeater">
		<div
			v-for="component in components"
			class="ship-component-repeater--section ship-component-repeater--section__in-columns"
		>
			<single-selector
				:columns="component.columns"
				:item-disabled="component.itemDisabled"
				:item-filter="component.itemFilter"
				:items="component.items"
				:removeable="component.removeable"
				:select-action="component.selectAction"
				:select-title="component.selectTitle"
				:ship-component-key="component.shipComponentKey"
				:title="component.title"
			></single-selector>
		</div>

		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
		<div class="ship-component-repeater--section ship-component-repeater--section__placeholder"></div>
	</div>
</template>

<style lang="scss">
.ship-component-repeater {
	display: flex;
	flex-wrap: wrap;

	.ship-component-repeater--section {
		padding: 10px;
		flex: 1 1 300px;
		max-width: 600px;

		&.ship-component-repeater--section__placeholder {
			padding: 0;
			margin: 0;
		}
	}
}
</style>

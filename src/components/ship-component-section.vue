<script>
	import singleSelector from "./single-selector.vue";

	export default {
		name: "shipComponentSection",
		props: ["title", "components"],
		components: {
			singleSelector
		},
	}
</script>

<template>
	<div class="ship-component-section">
		<div class="ship-component-section--title">
			{{ title }}
		</div>
		<div class="ship-component-section--columns">
			<div
				v-for="component in components"
				class="ship-component-section--section ship-component-section--section__in-columns"
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

			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
			<div class="ship-component-section--section ship-component-section--section__placeholder"></div>
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

	.ship-component-section--columns {
		display: flex;
		flex-wrap: wrap;
	}

	.ship-component-section--section {
		padding: 10px;
		flex: 1 1 300px;
		max-width: 600px;

		&.ship-component-section--section__placeholder {
			padding: 0;
			margin: 0;
		}
	}
}
</style>

<template>
	<div id="app" class="app">
		<b-navbar toggleable="md" type="dark" variant="dark" :sticky="true">
			<b-navbar-brand href="#">TODO TITLE GOES HERE</b-navbar-brand>
		</b-navbar>

		<div class="app--section">
			<select-frame></select-frame>
		</div>

		<div class="app--section">
			<single-selector
				:columns="powerCoreSelectorArgs.columns"
				:item-filter="powerCoreSelectorArgs.itemFilter"
				:items="powerCoreSelectorArgs.items"
				:modal-fitle="powerCoreSelectorArgs.modalTitle"
				:select-action="powerCoreSelectorArgs.selectAction"
				:ship-component-key="powerCoreSelectorArgs.shipComponentKey"
				:title="powerCoreSelectorArgs.title"
			></single-selector>
		</div>

	</div>
</template>

<script>
import { SET_POWER_CORE } from "./store.js";
import powerCores from "./data/power-cores.json";

import selectFrame from "./components/select-frame.vue";
import singleSelector from "./components/single-selector.vue";

export default {
	name: 'app',
	data () {
		return {
			powerCoreSelectorArgs: {
				columns: [
					{ name: "Power core", key: "name" },
					{ name: "PCU",        key: "pcu" },
					{ name: "Cost",       key: "cost" },
				],
				itemFilter: function (currentShip, powerCore) {
					let size = currentShip.frame.size;
					return powerCore.sizes[size];
				},
				items: powerCores,
				modalTitle: "Select a Power Core",
				selectAction: SET_POWER_CORE,
				shipComponentKey: "powerCore",
				title: "Power Core",
			},
		}
	},
	components: {
		selectFrame,
		singleSelector,
	}
}
</script>

<style lang="scss">
.app {
	.app--section {
		padding: 10px;
	}
}
</style>

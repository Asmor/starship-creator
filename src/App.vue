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

		<div class="app--section">
			<single-selector
				:columns="thrusterSelectorArgs.columns"
				:item-filter="thrusterSelectorArgs.itemFilter"
				:items="thrusterSelectorArgs.items"
				:modal-fitle="thrusterSelectorArgs.modalTitle"
				:select-action="thrusterSelectorArgs.selectAction"
				:ship-component-key="thrusterSelectorArgs.shipComponentKey"
				:title="thrusterSelectorArgs.title"
			></single-selector>
		</div>

	</div>
</template>

<script>
import {
	SET_POWER_CORE,
	SET_THRUSTERS,
} from "./store.js";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

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
			thrusterSelectorArgs: {
				columns: [
					{ name: "Thrusters",    key: "name" },
					{ name: "Speed",        key: "speed" },
					{ name: "Piloting Mod", key: "pilotingMod" },
					{ name: "PCU Cost",     key: "pcuCost" },
					{ name: "Cost",         key: "cost" },
				],
				itemFilter: function (currentShip, thruster) {
					let size = currentShip.frame.size;
					return thruster.size === size;
				},
				items: thrusters,
				modalTitle: "Select Thrusters",
				selectAction: SET_THRUSTERS,
				shipComponentKey: "thrusters",
				title: "Thrusters",
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

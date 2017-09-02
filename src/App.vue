<script>
import {
	SET_ARMOR,
	SET_POWER_CORE,
	SET_THRUSTERS,
} from "./store.js";

import armors from "./data/armors.json";
import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

import selectFrame from "./components/select-frame.vue";
import singleSelector from "./components/single-selector.vue";

export default {
	name: 'app',
	data () {
		return {
			armorSelectorArgs: {
				columns: [
					{ name: "Armor", key: "name" },
					{ name: "AC Bonus", key: "acBonus", center: true },
					{ name: "TL Mod", key: "tlMod", hideIfZero: true, center: true },
					{ name: "Turn Distance", key: "turnDistance", hideIfZero: true, center: true },
					{ name: "Cost", key: "cost", multiplyBySize: true, addendum: "based on size", center: true },
				],
				items: armors,
				modalTitle: "Select Armor",
				selectAction: SET_ARMOR,
				shipComponentKey: "armor",
				title: "Armor",
			},
			powerCoreSelectorArgs: {
				columns: [
					{ name: "Power core", key: "name" },
					{ name: "PCU",        key: "pcu", center: true },
					{ name: "Cost",       key: "cost", center: true },
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
					{ name: "Speed",        key: "speed", center: true },
					{ name: "Piloting Mod", key: "pilotingMod", center: true },
					{ name: "PCU Cost",     key: "pcuCost", center: true },
					{ name: "Cost",         key: "cost", center: true },
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

		<div class="app--section">
			<single-selector
				:columns="armorSelectorArgs.columns"
				:item-filter="armorSelectorArgs.itemFilter"
				:items="armorSelectorArgs.items"
				:modal-fitle="armorSelectorArgs.modalTitle"
				:select-action="armorSelectorArgs.selectAction"
				:ship-component-key="armorSelectorArgs.shipComponentKey"
				:title="armorSelectorArgs.title"
			></single-selector>
		</div>

	</div>
</template>

<style lang="scss">
.app {
	.app--section {
		padding: 10px;
	}
}
</style>

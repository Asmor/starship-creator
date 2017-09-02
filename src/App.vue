<script>
import {
	SET_ARMOR,
	SET_DRIFT_ENGINE,
	SET_POWER_CORE,
	SET_THRUSTERS,
} from "./store.js";

import { sizeToInt } from "./util.js";

import armors from "./data/armors.json";
import driftEngines from "./data/drift-engines.json";
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
				selectTitle: "Select armor",
				selectAction: SET_ARMOR,
				shipComponentKey: "armor",
				title: "Armor",
			},
			driftEngineSelectorArgs: {
				columns: [
					{ name: "Drift engine", key: "name" },
					{ name: "Rating",       key: "rating", hideIfZero: true, center: true },
					{ name: "Minimum PCU",  key: "minPcu", hideIfZero: true, center: true },
					{ name: "Cost",         key: "cost", center: true },
				],
				itemDisabled: function (currentShip, driftEngine) {
					let pcu = currentShip.powerCore.pcu;
					let minPcu = driftEngine.minPcu;

					return pcu >= minPcu;
				},
				itemFilter: function (currentShip, driftEngine) {
					let maxSize = sizeToInt[driftEngine.maxSize];
					let size = sizeToInt[currentShip.frame.size];
					return size <= maxSize;
				},
				items: driftEngines,
				selectTitle: "Select a drift engine",
				selectAction: SET_DRIFT_ENGINE,
				shipComponentKey: "driftEngine",
				title: "Drift Engine",
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
				selectTitle: "Select a power core",
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
				selectTitle: "Select thrusters",
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
				:select-action="powerCoreSelectorArgs.selectAction"
				:select-title="powerCoreSelectorArgs.selectTitle"
				:ship-component-key="powerCoreSelectorArgs.shipComponentKey"
				:title="powerCoreSelectorArgs.title"
			></single-selector>
		</div>

		<div class="app--section">
			<single-selector
				:columns="thrusterSelectorArgs.columns"
				:item-filter="thrusterSelectorArgs.itemFilter"
				:items="thrusterSelectorArgs.items"
				:select-action="thrusterSelectorArgs.selectAction"
				:select-title="thrusterSelectorArgs.selectTitle"
				:ship-component-key="thrusterSelectorArgs.shipComponentKey"
				:title="thrusterSelectorArgs.title"
			></single-selector>
		</div>

		<div class="app--section">
			<single-selector
				:columns="driftEngineSelectorArgs.columns"
				:item-disabled="driftEngineSelectorArgs.itemDisabled"
				:item-filter="driftEngineSelectorArgs.itemFilter"
				:items="driftEngineSelectorArgs.items"
				:select-action="driftEngineSelectorArgs.selectAction"
				:select-title="driftEngineSelectorArgs.selectTitle"
				:ship-component-key="driftEngineSelectorArgs.shipComponentKey"
				:title="driftEngineSelectorArgs.title"
			></single-selector>
		</div>

		<div class="app--section">
			<single-selector
				:columns="armorSelectorArgs.columns"
				:item-filter="armorSelectorArgs.itemFilter"
				:items="armorSelectorArgs.items"
				:select-action="armorSelectorArgs.selectAction"
				:select-title="armorSelectorArgs.selectTitle"
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

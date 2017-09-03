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

let armorSection = {
	columns: [
		{ name: "Armor", key: "name" },
		{ name: "AC Bonus", key: "acBonus", center: true },
		{ name: "TL Mod", key: "tlMod", hideIfZero: true, center: true },
		{ name: "Turn Distance", key: "turnDistance", hideIfZero: true, center: true },
		{ name: "Cost", key: "cost", multiplyBySize: true, addendum: "based on size", center: true },
	],
	items: armors,
	removeable: true,
	selectTitle: "Select armor",
	selectAction: SET_ARMOR,
	shipComponentKey: "armor",
	title: "Armor",
};
let driftEngineSection = {
	columns: [
		{ name: "Drift engine", key: "name" },
		{ name: "Rating",       key: "rating", hideIfZero: true, center: true },
		{ name: "Minimum PCU",  key: "minPcu", hideIfZero: true, center: true },
		{ name: "Cost",         key: "cost", multiplyBySize: true, addendum: "based on size", center: true },
	],
	itemDisabled: function (currentShip, driftEngine) {
		let pcu = currentShip.powerCore.pcu || 0;
		let minPcu = driftEngine.minPcu;

		return pcu >= minPcu;
	},
	itemFilter: function (currentShip, driftEngine) {
		let maxSize = sizeToInt[driftEngine.maxSize];
		let size = sizeToInt[currentShip.frame.size];
		return size <= maxSize;
	},
	items: driftEngines,
	removeable: true,
	selectTitle: "Select a drift engine",
	selectAction: SET_DRIFT_ENGINE,
	shipComponentKey: "driftEngine",
	title: "Drift Engine",
};
let powerCoreSection = {
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
};
let thrustersSection = {
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
};

export default {
	name: 'app',
	data () {
		return {
			simpleSections: [
				powerCoreSection,
				thrustersSection,
				driftEngineSection,
				armorSection,
			],
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

		<div
			v-for="section in simpleSections"
			class="app--section"
		>
			<single-selector
				:columns="section.columns"
				:item-disabled="section.itemDisabled"
				:item-filter="section.itemFilter"
				:items="section.items"
				:removeable="section.removeable"
				:select-action="section.selectAction"
				:select-title="section.selectTitle"
				:ship-component-key="section.shipComponentKey"
				:title="section.title"
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

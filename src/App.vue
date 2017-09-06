<script>
import {
	store,
	SET_ARMOR,
	SET_COMPUTER,
	SET_DEFENSES,
	SET_DRIFT_ENGINE,
	SET_POWER_CORE,
	SET_SENSORS,
	SET_SHIELDS,
	SET_THRUSTERS,
} from "./store.js";

import { sizeToInt } from "./util.js";

import armors from "./data/armors.json";
import computers from "./data/computers.json";
import defenses from "./data/defensive-countermeasures.json";
import driftEngines from "./data/drift-engines.json";
import powerCores from "./data/power-cores.json";
import shields from "./data/shields.json";
import sensors from "./data/sensors.json";
import thrusters from "./data/thrusters.json";

import selectFrame from "./components/select-frame.vue";
import shipComponentSection from "./components/ship-component-section.vue";
import shipComponentRepeater from "./components/ship-component-repeater.vue";
import weaponGroup from "./components/weapon-group.vue";
import weaponOptionsModal from "./components/weapon-options-modal.vue";
import weaponSelectModal from "./components/weapon-select-modal.vue";

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
let computerSection = {
	columns: [
		{ name: "Computer", key: "name" },
		{ name: "Bonus",    key: "bonus", hideIfZero: true, center: true },
		{ name: "Nodes",    key: "nodes", hideIfZero: true, center: true },
		{ name: "PCU",      key: "pcu",   center: true },
		{ name: "Cost",     key: "cost",  center: true },
	],
	items: computers,
	selectTitle: "Select computer",
	selectAction: SET_COMPUTER,
	shipComponentKey: "computer",
	title: "Computer",
};
let defensesSection = {
	columns: [
		{ name: "Defensive Countermeasures", key: "name" },
		{ name: "TL Bonus", key: "tlBonus", hideIfZero: true, center: true },
		{ name: "PCU", key: "pcu", hideIfZero: true, center: true },
		{ name: "Cost", key: "cost", center: true },
	],
	items: defenses,
	removeable: true,
	selectTitle: "Select defensive countermeasures",
	selectAction: SET_DEFENSES,
	shipComponentKey: "defenses",
	title: "Defensive Countermeasures",
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
let sensorsSection = {
	columns: [
		{ name: "Sensors", key: "name" },
		{ name: "Range", key: "range", center: true },
		{ name: "Modifier", key: "modifier", center: true },
		{ name: "Cost", key: "cost", center: true },
	],
	items: sensors,
	selectTitle: "Select sensors",
	selectAction: SET_SENSORS,
	shipComponentKey: "sensors",
	title: "Sensors",
};
let shieldsSection = {
	columns: [
		{ name: "Shield", key: "name" },
		{ name: "Total SP", key: "totalSp", hideIfZero: true, center: true },
		{ name: "Regend (SP/min)", key: "regen", hideIfZero: true, center: true },
		{ name: "Cost", key: "cost", center: true },
	],
	items: shields,
	removeable: true,
	selectTitle: "Select shields",
	selectAction: SET_SHIELDS,
	shipComponentKey: "shields",
	title: "Shields",
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
	store,
	data () {
		return {
			coreComponents: [
				powerCoreSection,
				computerSection,
				sensorsSection,
				thrustersSection,
				driftEngineSection,
			],
			defensiveComponents: [
				armorSection,
				defensesSection,
				shieldsSection,
			],
		}
	},
	computed: {
		frameSelected: function () {
			return this.$store.state.currentShip.frame;
		},
	},
	components: {
		selectFrame,
		shipComponentRepeater,
		shipComponentSection,
		weaponGroup,
		weaponOptionsModal,
		weaponSelectModal,
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

		<ship-component-section v-if="frameSelected" title="Core systems">
			<ship-component-repeater :components="coreComponents"></ship-component-repeater>
		</ship-component-section>

		<ship-component-section v-if="frameSelected" title="Defenses">
			<ship-component-repeater :components="defensiveComponents"></ship-component-repeater>
		</ship-component-section>

		<ship-component-section v-if="frameSelected"title="Weapons">
			<div class="app--flex-layout">
				<div class="app--flex-item">
					<weapon-group arc="forward" title="Forward arc"></weapon-group>
				</div>
				<div class="app--flex-item">
					<weapon-group arc="port" title="Port arc"></weapon-group>
				</div>
				<div class="app--flex-item">
					<weapon-group arc="starboard" title="Starboard arc"></weapon-group>
				</div>
				<div class="app--flex-item">
					<weapon-group arc="aft" title="Aft arc"></weapon-group>
				</div>
				<div class="app--flex-item">
					<weapon-group arc="turret" title="Turret"></weapon-group>
				</div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
				<div class="app--flex-item app--flex-item__placeholder"></div>
			</div>
		</ship-component-section>

		<weapon-select-modal></weapon-select-modal>
		<weapon-options-modal></weapon-options-modal>
	</div>
</template>

<style lang="scss">
.app {
	.app--columns {
		display: flex;
		flex-wrap: wrap;
	}

	.app--section {
		padding: 10px;

		&.app--section__in-columns {
			flex: 1 1 300px;
			max-width: 600px;
		}
	}

	.app--flex-layout {
		display: flex;
		flex-wrap: wrap;
	}

	.app--flex-item {
		flex: 1 1 300px;
		padding: 10px;

		&.app--flex-item__placeholder {
			padding: 0;
		}
	}
}
</style>

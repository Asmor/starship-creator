import Vue from "vue";
import Vuex from "vuex";

import { sizeToInt } from "./util.js";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

Vue.use(Vuex);

let config = {
	strict: true,
	state: {
		currentShip: {},
	},
	actions: {},
	mutations: {},
	getters: {},
};

const SET_ARMOR = "SET_ARMOR";
const SET_ARMOR_MUTATION = "SET_ARMOR_MUTATION";
const SET_COMPUTER = "SET_COMPUTER";
const SET_COMPUTER_MUTATION = "SET_COMPUTER_MUTATION";
const SET_DEFENSES = "SET_DEFENSES";
const SET_DEFENSES_MUTATION = "SET_DEFENSES_MUTATION";
const SET_DRIFT_ENGINE = "SET_DRIFT_ENGINE";
const SET_DRIFT_ENGINE_MUTATION = "SET_DRIFT_ENGINE_MUTATION";
const SET_FRAME = "SET_FRAME";
const SET_FRAME_MUTATION = "SET_FRAME_MUTATION";
const SET_POWER_CORE = "SET_POWER_CORE";
const SET_POWER_CORE_MUTATION = "SET_POWER_CORE_MUTATION";
const SET_THRUSTERS = "SET_THRUSTERS";
const SET_THRUSTERS_MUTATION = "SET_THRUSTERS_MUTATION";

// Setup everything with simple default actions and mutations, override with more complex logic as
// needed
[
	{ action: SET_ARMOR,        mutation: SET_ARMOR_MUTATION,        shipComponent: "armor" },
	{ action: SET_COMPUTER,     mutation: SET_COMPUTER_MUTATION,     shipComponent: "computer" },
	{ action: SET_DEFENSES,     mutation: SET_DEFENSES_MUTATION,     shipComponent: "defenses" },
	{ action: SET_DRIFT_ENGINE, mutation: SET_DRIFT_ENGINE_MUTATION, shipComponent: "driftEngine" },
	{ action: SET_FRAME,        mutation: SET_FRAME_MUTATION,        shipComponent: "frame" },
	{ action: SET_POWER_CORE,   mutation: SET_POWER_CORE_MUTATION,   shipComponent: "powerCore" },
	{ action: SET_THRUSTERS,    mutation: SET_THRUSTERS_MUTATION,    shipComponent: "thrusters" },
].forEach(function (args) {
	// All components are initialized to false because it seems like VueX handles null specially
	config.state.currentShip[args.shipComponent] = false;

	config.actions[args.action] = ({ commit }, item) => {
		commit(args.mutation, item);
	};

	config.mutations[args.mutation] = (state, item) => {
		state.currentShip[args.shipComponent] = item;
	};
});

config.mutations[SET_FRAME_MUTATION] = (state, frame) => {
	let ship = state.currentShip;
	ship.frame = frame;

	// Many components are only valid for particular ship sizes, so when we change frame size we
	// need to check that the components are valid. If they're not, switch to the first one that is.
	var powerCoreValid = ship.powerCore && ship.powerCore.sizes[frame.size];
	if ( !powerCoreValid ) {
		config.mutations[SET_POWER_CORE_MUTATION](state, false);
	}

	var thrustersValid = ship.thrusters && (ship.thrusters.size === frame.size);
	if ( !thrustersValid ) {
		config.mutations[SET_THRUSTERS_MUTATION](state, false);
	}

	if ( ship.driftEngine ) {
		let maxSize = sizeToInt[state.currentShip.driftEngine.maxSize];
		let size = sizeToInt[frame.size];

		if ( size > maxSize ) {
			config.mutations[SET_DRIFT_ENGINE_MUTATION](state, false);
		}
	}
};

config.mutations[SET_POWER_CORE_MUTATION] = (state, powerCore) => {
	let ship = state.currentShip;
	ship.powerCore = powerCore;

	// Drift engines have a minimum PCU requirement
	if ( ship.driftEngine ) {
		let minPcu = ship.driftEngine.minPcu;
		let pcu = powerCore.pcu || 0;

		if ( pcu < minPcu ) {
			config.mutations[SET_DRIFT_ENGINE_MUTATION](state, false);
		}
	}
};

const store = new Vuex.Store(config);

export {
	store,
	SET_ARMOR,
	SET_COMPUTER,
	SET_DEFENSES,
	SET_DRIFT_ENGINE,
	SET_FRAME,
	SET_POWER_CORE,
	SET_THRUSTERS,
};

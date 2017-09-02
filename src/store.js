import Vue from "vue";
import Vuex from "vuex";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

Vue.use(Vuex);

let config = {
	strict: true,
	state: {
		currentShip: {
			armor: false,
			frame: false,
			powerCore: false,
			thrusters: false,
		},
	},
	actions: {},
	mutations: {},
	getters: {},
};

const SET_ARMOR = "SET_ARMOR";
const SET_ARMOR_MUTATION = "SET_ARMOR_MUTATION";
const SET_FRAME = "SET_FRAME";
const SET_FRAME_MUTATION = "SET_FRAME_MUTATION";
const SET_POWER_CORE = "SET_POWER_CORE";
const SET_POWER_CORE_MUTATION = "SET_POWER_CORE_MUTATION";
const SET_THRUSTERS = "SET_THRUSTERS";
const SET_THRUSTERS_MUTATION = "SET_THRUSTERS_MUTATION";

// Setup everything with simple default actions and mutations, override with more complex logic as
// needed
[
	{ action: SET_ARMOR,      mutation: SET_ARMOR_MUTATION,      shipComponent: "armor" },
	{ action: SET_FRAME,      mutation: SET_FRAME_MUTATION,      shipComponent: "frame" },
	{ action: SET_POWER_CORE, mutation: SET_POWER_CORE_MUTATION, shipComponent: "powerCore" },
	{ action: SET_THRUSTERS,  mutation: SET_THRUSTERS_MUTATION,  shipComponent: "thrusters" },
].forEach(function (args) {
	config.actions[args.action] = ({ commit }, item) => {
		commit(args.mutation, item);
	};

	config.mutations[args.mutation] = (state, item) => {
		state.currentShip[args.shipComponent] = item;
	};
});

config.mutations[SET_FRAME_MUTATION] = (state, frame) => {
	state.currentShip.frame = frame;

	// Many components are only valid for particular ship sizes, so when we change frame size we
	// need to check that the components are valid. If they're not, switch to the first one that is.
	var powerCoreValid = state.currentShip.powerCore && state.currentShip.powerCore.sizes[frame.size];
	if ( !powerCoreValid ) {
		state.currentShip.powerCore = powerCores.find(core => core.sizes[frame.size]);
	}

	var thrustersValid = state.currentShip.thrusters && (state.currentShip.thrusters.size === frame.size);
	if ( !thrustersValid ) {
		state.currentShip.thrusters = thrusters.find(thruster => thruster.size === frame.size);
	}
};

const store = new Vuex.Store(config);

export {
	store,
	SET_ARMOR,
	SET_FRAME,
	SET_POWER_CORE,
	SET_THRUSTERS,
};

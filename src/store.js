import Vue from "vue";
import Vuex from "vuex";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

Vue.use(Vuex);

const SET_ARMOR = "SET_ARMOR";
const SET_ARMOR_MUTATION = "SET_ARMOR_MUTATION";
const SET_FRAME = "SET_FRAME";
const SET_FRAME_MUTATION = "SET_FRAME_MUTATION";
const SET_POWER_CORE = "SET_POWER_CORE";
const SET_POWER_CORE_MUTATION = "SET_POWER_CORE_MUTATION";
const SET_THRUSTERS = "SET_THRUSTERS";
const SET_THRUSTERS_MUTATION = "SET_THRUSTERS_MUTATION";

const store = new Vuex.Store({
	strict: true,
	state: {
		currentShip: {
			armor: false,
			frame: false,
			powerCore: false,
			thrusters: false,
		},
	},
	actions: {
		SET_ARMOR: ({ commit }, frame) => {
			commit(SET_ARMOR_MUTATION, frame);
		},
		SET_FRAME: ({ commit }, frame) => {
			commit(SET_FRAME_MUTATION, frame);
		},
		SET_POWER_CORE: ({ commit }, powerCore) => {
			commit(SET_POWER_CORE_MUTATION, powerCore);
		},
		SET_THRUSTERS: ({ commit }, thruster) => {
			commit(SET_THRUSTERS_MUTATION, thruster);
		},
	},
	mutations: {
		SET_ARMOR_MUTATION: (state, armor) => {
			state.currentShip.armor = armor;
		},
		SET_FRAME_MUTATION: (state, frame) => {
			state.currentShip.frame = frame;

			// Check if the power core is valid for the new frame size and, if not, switch to the
			// first power core that is
			var powerCoreValid = state.currentShip.powerCore && state.currentShip.powerCore.sizes[frame.size];
			if ( !powerCoreValid ) {
				state.currentShip.powerCore = powerCores.find(core => core.sizes[frame.size]);
			}

			// Check if the power core is valid for the new frame size and, if not, switch to the
			// first power core that is
			var thrustersValid = state.currentShip.thrusters && (state.currentShip.thrusters.size === frame.size);
			if ( !thrustersValid ) {
				state.currentShip.thrusters = thrusters.find(thruster => thruster.size === frame.size);
			}
		},
		SET_POWER_CORE_MUTATION: (state, powerCore) => {
			state.currentShip.powerCore = powerCore;
		},
		SET_THRUSTERS_MUTATION: (state, thruster) => {
			state.currentShip.thrusters = thruster;
		},
	},
	getters: {},
});

export {
	store,
	SET_ARMOR,
	SET_FRAME,
	SET_POWER_CORE,
	SET_THRUSTERS,
};

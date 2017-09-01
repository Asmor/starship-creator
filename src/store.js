import Vue from "vue";
import Vuex from "vuex";

import powerCores from "./data/power-cores.json";

Vue.use(Vuex);

const SET_FRAME = "SET_FRAME";
const SET_FRAME_MUTATION = "SET_FRAME_MUTATION";
const SET_POWER_CORE = "SET_POWER_CORE";
const SET_POWER_CORE_MUTATION = "SET_POWER_CORE_MUTATION";

const store = new Vuex.Store({
	strict: true,
	state: {
		currentShip: {
			frame: false,
			powerCore: false,
		},
	},
	actions: {
		SET_FRAME: ({ commit }, frame) => {
			commit(SET_FRAME_MUTATION, frame);
		},
		SET_POWER_CORE: ({ commit }, powerCore) => {
			commit(SET_POWER_CORE_MUTATION, powerCore);
		},
	},
	mutations: {
		SET_FRAME_MUTATION: (state, frame) => {
			state.currentShip.frame = frame;

			// Check if the power core is valid for the new frame size and, if not, switch to the
			// first power core that is
			var powerCoreValid = state.currentShip.powerCore && state.currentShip.powerCore.sizes[frame.size];
			if ( !powerCoreValid ) {
				state.currentShip.powerCore = powerCores.find(core => core.sizes[frame.size]);
			}
		},
		SET_POWER_CORE_MUTATION: (state, powerCore) => {
			state.currentShip.powerCore = powerCore;
		},
	},
	getters: {},
});

export {
	store,
	SET_FRAME,
	SET_POWER_CORE,
};

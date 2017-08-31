import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: true,
	state: {
		currentShip: {
			frame: false,
		},
	},
	actions: {
		SET_FRAME: ({ commit }, frame) => {
			commit("SET_FRAME_MUTATION", frame);
		},
	},
	mutations: {
		SET_FRAME_MUTATION: (state, frame) => {
			state.currentShip.frame = frame;
			console.log("Mutate!", state.currentShip.frame);
		},
	},
	getters: {},
});

export default store;

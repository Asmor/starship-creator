import Vue from "vue";
import Vuex from "vuex";

import {
	sizeToInt,
	weaponClassToInt,
} from "./util.js";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

Vue.use(Vuex);

let config = {
	strict: true,
	state: {
		currentShip: {
			weapons: {
				front: [],
				port: [],
				starboard: [],
				aft: [],
				turret: [],
			},
			weaponLinks: {
				front: false,
				port: false,
				starboard: false,
				aft: false,
				turret: false,
			},
		},
	},
	actions: {},
	mutations: {},
	getters: {},
};

const ADD_WEAPON = "ADD_WEAPON";
const ADD_WEAPON_MUTATION = "ADD_WEAPON_MUTATION";
const LINK_WEAPON = "LINK_WEAPON";
const LINK_WEAPON_MUTATION = "LINK_WEAPON_MUTATION";
const REMOVE_WEAPON = "REMOVE_WEAPON";
const REMOVE_WEAPON_MUTATION = "REMOVE_WEAPON_MUTATION";
const UNLINK_WEAPON = "UNLINK_WEAPON";
const UNLINK_WEAPON_MUTATION = "UNLINK_WEAPON_MUTATION";
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
const SET_SENSORS = "SET_SENSORS";
const SET_SENSORS_MUTATION = "SET_SENSORS_MUTATION";
const SET_SHIELDS = "SET_SHIELDS";
const SET_SHIELDS_MUTATION = "SET_SHIELDS_MUTATION";
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
	{ action: SET_SENSORS,      mutation: SET_SENSORS_MUTATION,      shipComponent: "sensors" },
	{ action: SET_SHIELDS,      mutation: SET_SHIELDS_MUTATION,      shipComponent: "shields" },
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
	let frameSizeInt = sizeToInt[frame.size];
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

	["front", "port", "starboard", "aft", "turret"].forEach(arc => {
		let weaponsToRemove = [];

		state.currentShip.weapons[arc].forEach(weapon => {
			let weaponSizeInt = weaponClassToInt[weapon.class];

			// Get all weapons that need to be removed first, then remove them, so we don't mutate
			// array while we're searching through it
			if ( weaponSizeInt > frameSizeInt ) {
				weaponsToRemove.push(weapon);
			}

		});

		weaponsToRemove.forEach(weapon => config.mutations[REMOVE_WEAPON_MUTATION](state, { arc, weapon }));
	});
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

[
	{ action: ADD_WEAPON,    mutation: ADD_WEAPON_MUTATION },
	{ action: LINK_WEAPON,   mutation: LINK_WEAPON_MUTATION },
	{ action: REMOVE_WEAPON, mutation: REMOVE_WEAPON_MUTATION },
	{ action: UNLINK_WEAPON, mutation: UNLINK_WEAPON_MUTATION },
].forEach(function (args) {
	config.actions[args.action] = ({commit}, {weapon, arc}) => {
		commit(args.mutation, {weapon, arc});
	};
});

config.mutations[ADD_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	state.currentShip.weapons[arc].push(weapon);
};

config.mutations[LINK_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	state.currentShip.weaponLinks[arc] = weapon;
};

config.mutations[REMOVE_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	let weapons = state.currentShip.weapons[arc];
	let linked = (state.currentShip.weaponLinks[arc] && state.currentShip.weaponLinks[arc].name === weapon.name);
	let deleteIndex = -1;
	let matchingCount = 0;

	let found = weapons.forEach((shipWeapon, index) => {
		if ( shipWeapon.name === weapon.name ) {
			deleteIndex = index;
			matchingCount++;
		}
	});

	if ( deleteIndex >= 0 ) {
		weapons.splice(deleteIndex, 1);

		if ( linked  && matchingCount <= 2 ) {
			// We no longer have enough of these, so unlink them!
			config.mutations[UNLINK_WEAPON_MUTATION](state, { weapon, arc });
		}
	} else {
		console.warn("Couldn't find", shipWeapon, "in arc:", arc);
	}
};

config.mutations[UNLINK_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	if ( state.currentShip.weaponLinks[arc].name === weapon.name ) {
		state.currentShip.weaponLinks[arc] = false;
	} else {
		console.warn("Not linked; tried to unlink", weapon, "from arc:", arc);
	}
};

const store = new Vuex.Store(config);

export {
	store,
	ADD_WEAPON,
	LINK_WEAPON,
	REMOVE_WEAPON,
	UNLINK_WEAPON,
	SET_ARMOR,
	SET_COMPUTER,
	SET_DEFENSES,
	SET_DRIFT_ENGINE,
	SET_FRAME,
	SET_POWER_CORE,
	SET_SENSORS,
	SET_SHIELDS,
	SET_THRUSTERS,
};

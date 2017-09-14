import Vue from "vue";
import Vuex from "vuex";

import {
	nameSort,
	pluralize,
	sizeToInt,
	weaponArcs,
	weaponClassToInt,
	weaponClassToMountInt,
} from "./util.js";

import powerCores from "./data/power-cores.json";
import thrusters from "./data/thrusters.json";

Vue.use(Vuex);

let config = {
	strict: true,
	state: {
		currentShip: {
			weapons: {
				forward: [],
				port: [],
				starboard: [],
				aft: [],
				turret: [],
			},
			expansionBays: [],
			powerCores: [],
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

const ADD_POWER_CORE = "ADD_POWER_CORE";
const ADD_POWER_CORE_MUTATION = "ADD_POWER_CORE_MUTATION";
const REMOVE_POWER_CORE = "REMOVE_POWER_CORE";
const REMOVE_POWER_CORE_MUTATION = "REMOVE_POWER_CORE_MUTATION";

const ADD_EXPANSION_BAY = "ADD_EXPANSION_BAY";
const ADD_EXPANSION_BAY_MUTATION = "ADD_EXPANSION_BAY_MUTATION";
const REMOVE_EXPANSION_BAY = "REMOVE_EXPANSION_BAY";
const REMOVE_EXPANSION_BAY_MUTATION = "REMOVE_EXPANSION_BAY_MUTATION";

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
	{ action: ADD_POWER_CORE,   mutation: ADD_POWER_CORE_MUTATION,   shipComponent: "powerCore" },
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
	ship.powerCores
	.reduce((toRemove, powerCore) => {
		let powerCoreValid = powerCore && powerCore.sizes[frame.size];

		if ( !powerCoreValid ) {
			toRemove.push(powerCore);
		}

		return toRemove;
	}, [])
	.forEach(powerCoreToRemove => {
		config.mutations[REMOVE_POWER_CORE_MUTATION](state, powerCoreToRemove)
	});

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

	["forward", "port", "starboard", "aft", "turret"].forEach(arc => {
		let weaponsToRemove = [];

		// Get all weapons that need to be removed first, then remove them, so we don't mutate array
		// while we're searching through it
		state.currentShip.weapons[arc].forEach(weapon => {
			let weaponSizeInt = weaponClassToInt[weapon.class];

			if ( weaponSizeInt > frameSizeInt ) {
				weaponsToRemove.push(weapon);
			}

		});

		weaponsToRemove.forEach(weapon => config.mutations[REMOVE_WEAPON_MUTATION](state, { arc, weapon }));
	});
};

let linkedWeapons = {};
function makeLinked(weapon) {
	let linked = linkedWeapons[weapon.name];

	if ( !linked ) {
		linked = {
			original: weapon,
			linked: true,
			name: "Linked twin " + pluralize(weapon.name).toLowerCase(),
			class: weapon.class,
			type: weapon.type,
			range: weapon.range,
			speed: weapon.speed,
			damage: weapon.damage + " (each)",
			pcu: weapon.pcu * 2,
			cost: Math.floor(weapon.cost * 2.5),
			specialProperties: weapon.specialProperties,
		};
	}

	return linked;
}

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
	state.currentShip.weapons[arc].sort(nameSort);
};

config.mutations[LINK_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	// Remove two copies of the weapon...
	config.mutations[REMOVE_WEAPON_MUTATION](state, { weapon, arc });
	config.mutations[REMOVE_WEAPON_MUTATION](state, { weapon, arc });

	// And add the linked weapon
	config.mutations[ADD_WEAPON_MUTATION](state, { weapon: makeLinked(weapon), arc });
};

config.mutations[REMOVE_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	let weapons = state.currentShip.weapons[arc];
	let deleteIndex = -1;

	let found = weapons.forEach((shipWeapon, index) => {
		if ( shipWeapon.name === weapon.name ) {
			deleteIndex = index;
		}
	});

	if ( deleteIndex >= 0 ) {
		weapons.splice(deleteIndex, 1);
	} else {
		console.warn("Couldn't find", shipWeapon, "in arc:", arc);
	}
};

config.mutations[UNLINK_WEAPON_MUTATION] = (state, {weapon, arc}) => {
	if ( !weapon.linked ) {
		console.warn("Tried to unlink a weapon that wasn't linked:", weapon);
		return;
	}

	// Remove the linked weapon
	config.mutations[REMOVE_WEAPON_MUTATION](state, { weapon, arc });

	// Add two copies of original weapon back to ship
	config.mutations[ADD_WEAPON_MUTATION](state, { weapon: weapon.original, arc });
	config.mutations[ADD_WEAPON_MUTATION](state, { weapon: weapon.original, arc });
};

[
	{ action: ADD_EXPANSION_BAY,    mutation: ADD_EXPANSION_BAY_MUTATION },
	{ action: REMOVE_EXPANSION_BAY, mutation: REMOVE_EXPANSION_BAY_MUTATION },
	{ action: ADD_POWER_CORE,    mutation: ADD_POWER_CORE_MUTATION },
	{ action: REMOVE_POWER_CORE, mutation: REMOVE_POWER_CORE_MUTATION },
].forEach(function (args) {
	config.actions[args.action] = ({commit}, expansionBay) => {
		commit(args.mutation, expansionBay);
	};
});

config.mutations[ADD_EXPANSION_BAY_MUTATION] = (state, expansionBay) => {
	state.currentShip.expansionBays.push(expansionBay);
	state.currentShip.expansionBays.sort(nameSort);
};

config.mutations[REMOVE_EXPANSION_BAY_MUTATION] = (state, expansionBay) => {
	let expansionBays = state.currentShip.expansionBays;
	let deleteIndex = -1;

	let found = expansionBays.forEach((shipExpansionBay, index) => {
		if ( shipExpansionBay.name === expansionBay.name ) {
			deleteIndex = index;
		}
	});

	if ( deleteIndex >= 0 ) {
		expansionBays.splice(deleteIndex, 1);
	} else {
		console.warn("Couldn't find", expansionBay);
	}
};

config.mutations[ADD_POWER_CORE_MUTATION] = (state, powerCore) => {
	state.currentShip.powerCores.push(powerCore);
	state.currentShip.powerCores.sort(nameSort);

	verifyDriftEngineMinPCU(state);
};

config.mutations[REMOVE_POWER_CORE_MUTATION] = (state, powerCore) => {
	let powerCores = state.currentShip.powerCores;
	let deleteIndex = -1;

	let found = powerCores.forEach((shipPowerCore, index) => {
		if ( shipPowerCore.name === powerCore.name ) {
			deleteIndex = index;
		}
	});

	if ( deleteIndex >= 0 ) {
		powerCores.splice(deleteIndex, 1);

		verifyDriftEngineMinPCU(state);
	} else {
		console.warn("Couldn't find power core", powerCore);
	}
};

const verifyDriftEngineMinPCU = state => {
	// Drift engines have a minimum PCU requirement
	let ship = state.currentShip;

	if ( ship.driftEngine ) {
		let pcu = config.getters.availablePcu(state);
		let minPcu = ship.driftEngine.minPcu;

		if ( pcu < minPcu ) {
			config.mutations[SET_DRIFT_ENGINE_MUTATION](state, false);
		}
	}
};

const tallyMounts = mounts => {
	let total = 0;
	let heavyOrBetter = 0;
	let capital = 0;

	mounts.forEach(mount => {
		total++;

		if ( mount >= 2 ) {
			heavyOrBetter++;
		}

		if ( mount === 3 ) {
			capital++;
		}
	});

	return {
		total,
		heavyOrBetter,
		capital,
	};
};

config.getters.availablePcu = state => {
	return state.currentShip.powerCores.reduce((total, powerCore) => {
		return total + powerCore.pcu;
	}, 0);
};

config.getters.usedPcu = state => {
	let pcu = 0;

	let ship = state.currentShip;

	ship.expansionBays.forEach(bay => pcu += bay.pcu);
	Object.keys(ship.weapons).forEach(arc => {
		ship.weapons[arc].forEach(weapon => pcu += weapon.pcu);
	});

	[
		ship.armor,
		ship.computer,
		ship.defenses,
		ship.sensors,
		ship.shields,
		ship.thrusters,
	].forEach(item => {
		if ( item && item.pcu ) {
			pcu += item.pcu;
		}
	});

	return pcu;
};

config.getters.usedBuildPoints = state => {
	let points = 0;

	let ship = state.currentShip;
	let shipSizeInt = sizeToInt[ship.frame.size];

	ship.powerCores.forEach(core => points += core.cost);
	ship.expansionBays.forEach(bay => points += bay.cost);

	// Items with static cost
	[
		ship.computer,
		ship.defenses,
		ship.frame,
		ship.sensors,
		ship.shields,
		ship.thrusters,
	].forEach(item => {
		if ( item && item.cost ) {
			points += item.cost;
		}
	});

	// Items with cost based on ship size
	[
		ship.armor,
		ship.driftEngine,
	].forEach(item => {
		if ( item && item.cost ) {
			points += item.cost * shipSizeInt;
		}
	});

	weaponArcs.forEach(arc => {
		ship.weapons[arc].forEach(weapon => points += weapon.cost);

		points += config.getters.costOfExtraMounts(state)(arc);
	});

	return points;
};

config.getters.extraMounts = state => {
	return arc => {
		var included = tallyMounts(config.getters.frameMounts(state)(arc));
		var used = tallyMounts(config.getters.usedMounts(state)(arc));

		let total = Math.max(0, used.total - included.total);
		let heavyOrBetter = Math.max(0, used.heavyOrBetter - included.heavyOrBetter);
		let capital = Math.max(0, used.capital - included.capital);

		return {
			total,
			heavyOrBetter,
			capital,
		};
	};
};

config.getters.extraMountCosts = state => {
	return arc => {
		let costs = {
			newMount: 3,
			heavy: 4,
			capital: 5,
		};

		if ( arc === "turret" ) {
			costs = {
				newMount: 5,
				heavy: 6,
				capital: 99999,
			};
		}

		return costs;
	};
};

config.getters.frameMounts = state => {
	return arc => {
		return state.currentShip.frame.mounts[arc] || [];
	};
};

config.getters.costOfExtraMounts = state => {
	return arc => {
		let costs = config.getters.extraMountCosts(state)(arc);
		let extraMounts = config.getters.extraMounts(state)(arc);

		return (extraMounts.total * costs.newMount)
			+ (extraMounts.heavyOrBetter * costs.heavy)
			+ (extraMounts.capital * costs.capital);
	};
};

config.getters.usedMounts = state => {
	return arc => {
		let weapons = state.currentShip.weapons[arc];
		let mounts = [];

		weapons.forEach(weapon => {
			mounts.push(weaponClassToMountInt[weapon.class]);

			// Linked weapons take up two slots
			if ( weapon.linked ) {
				mounts.push(weaponClassToMountInt[weapon.class]);
			}
		});
		return mounts;
	};
};

const store = new Vuex.Store(config);

export {
	store,

	ADD_WEAPON,
	LINK_WEAPON,
	REMOVE_WEAPON,
	UNLINK_WEAPON,

	ADD_EXPANSION_BAY,
	REMOVE_EXPANSION_BAY,

	ADD_POWER_CORE,
	REMOVE_POWER_CORE,

	SET_ARMOR,
	SET_COMPUTER,
	SET_DEFENSES,
	SET_DRIFT_ENGINE,
	SET_FRAME,
	SET_SENSORS,
	SET_SHIELDS,
	SET_THRUSTERS,
};

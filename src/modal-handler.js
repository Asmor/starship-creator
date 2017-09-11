let EXPANSION_BAY_OPTIONS_MODAL = "EXPANSION_BAY_OPTIONS_MODAL";
let EXPANSION_BAY_SELECT_MODAL = "EXPANSION_BAY_SELECT_MODAL";
let WEAPON_OPTIONS_MODAL = "WEAPON_OPTIONS_MODAL";
let WEAPON_SELECT_MODAL = "WEAPON_SELECT_MODAL";

let registeredModals = {};

const openModal = ({ modalId, args }) => {
	let opener = registeredModals[modalId];

	if ( opener ) {
		opener(args);
	} else {
		console.warn("No registered modal:", modalId, args);
	}
};

const registerModal = ({ modalId, opener }) => {
	registeredModals[modalId] = opener;
};

export {
	openModal,
	registerModal,
	EXPANSION_BAY_OPTIONS_MODAL,
	EXPANSION_BAY_SELECT_MODAL,
	WEAPON_OPTIONS_MODAL,
	WEAPON_SELECT_MODAL,
};

<script>
import {
	store,
	ADD_WEAPON,
} from "../store.js";
import weapons from "../data/weapons.json";
import {
	groupBy,
	nameSort,
	weaponClassToInt,
	rangeToInt,
} from "../util.js";
import {
	openModal,
	WEAPON_OPTIONS_MODAL,
	WEAPON_SELECT_MODAL,
} from "../modal-handler.js";

import singleItem from "./single-item.vue";

const weaponSort = (a, b) => {
	// Sort by Class, then by Type, then by Range, then by Name
	if ( a.class !== b.class ) {
		return weaponClassToInt[a.class] - weaponClassToInt[b.class];
	}

	if ( a.type !== b.type ) {
		return (a.type > b.type) ? 1 : -1;
	}

	if ( a.range !== b.range ) {
		return rangeToInt[a.range] - rangeToInt[b.range];
	}

	return (a.name > b.name) ? 1 : -1;

};

weapons.sort(weaponSort);

let modalCounter = 0;

let weaponsByClass = groupBy({
	collection: weapons,
	groupKey: "class",
});

Object.keys(weaponsByClass).forEach((weaponClass) => {
	weaponsByClass[weaponClass] = groupBy({
		collection: weaponsByClass[weaponClass],
		groupKey: "type",
	});
});

export default {
	name: "weaponGroup",
	store,
	data () {
		return {
			weapons,
			weaponsByClass,
			modalId: "weapon-group-modal" + modalCounter++,
		};
	},
	computed: {
		selectedWeapons: function () {
			// Sort modifies the original array, so we need to slice to get a new array to sort
			return this.$store.state.currentShip.weapons[this.arc].slice().sort(nameSort);
		},
		selectedFrame: function () {
			return this.$store.state.currentShip.frame;
		},
	},
	methods: {
		showWeaponOptionsModal(weapon) {
			openModal({
				modalId: WEAPON_OPTIONS_MODAL,
				args: { arc: this.arc, weapon },
			});
		},
		showWeaponSelectModal() {
			openModal({
				modalId: WEAPON_SELECT_MODAL,
				args: { arc: this.arc },
			});
		},
		weaponText(weapon) {
			var parts = [];

			parts.push(weapon.range + " range");
			if ( weapon.type === "Tracking" ) { parts.push("Speed " + weapon.speed); }
			parts.push(weapon.damage);
			if ( weapon.specialProperties ) { parts.push(weapon.specialProperties); }
			parts.push("PCU " + weapon.pcu);
			parts.push("Cost " + weapon.cost);

			return parts.join("; ");
		},
	},
	components: {
		singleItem,
	},
	props: ["arc", "title"],
};
</script>

<template>
	<div class="weapon-group">
		<single-item
			:title="title"
			no-rollover="true"
		>
			<div
				class="weapon-group--weapon"
				v-for="weapon in selectedWeapons"
				@click="showWeaponOptionsModal(weapon)"
			>
				<span class="weapon-group--weapon-title">{{ weapon.name }}</span>
				<span class="weapon-group--weapon-type">{{ weapon.class }} {{ weapon.type }}</span>
				<span class="weapon-group--weapon-description">{{ weaponText(weapon) }}</span>
			</div>

			<b-button
				variant="primary"
				@click="showWeaponSelectModal()"
				:disabled="selectedWeapons.length >= 3"
			>Add weapon</b-button>
		</single-item>
	</div>
</template>

<style lang="scss">
.weapon-group {
	height: 100%;

	.weapon-group--frame,
	.weapon-group--frame-option {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

	}

	.weapon-group--frame-option {
		padding: 10px;

		&.weapon-group--frame-option__active {
			background-color: #cfc;
		}
	}

	.weapon-group--weapon {
		padding: 5px 0;
	}
	
	.weapon-group--weapon-title {
		font-weight: bold;
	}
	
	.weapon-group--weapon-type {
		font-variant: small-caps;
	}
	
	.weapon-group--weapon-description {
		display: inline-block;
		padding-left: 10px;
	}
}
</style>

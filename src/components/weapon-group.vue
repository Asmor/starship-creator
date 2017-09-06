<script>
import {
	store,
	ADD_WEAPON,
} from "../store.js";
import weapons from "../data/weapons.json";
import {
	groupBy,
	nameSort,
	pluralize,
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

function makeLinked(weapon) {
	return {
		original: weapon,
		name: "Linked Twin " + pluralize(weapon.name),
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
			let weapons = [];
			let linkedWeapon = this.$store.state.currentShip.weaponLinks[this.arc];
			let linkedCount = 0;

			this.$store.state.currentShip.weapons[this.arc].slice().sort(nameSort).forEach(function (weapon) {
				if ( weapon.name === linkedWeapon.name ) {
					if ( linkedCount === 0 ) {
						weapons.push(makeLinked(weapon))
					} else if ( linkedCount === 1 ) {
						// This is the second one, ignore it
					} else {
						// We've already got both linked weapons, so push any more
						weapons.push(weapon);
					}

					linkedCount++;
				} else {
					weapons.push(weapon);
				}
			});

			return weapons;
		},
		selectedFrame: function () {
			return this.$store.state.currentShip.frame;
		},
	},
	methods: {
		showWeaponOptionsModal(weapon) {
			// Linked weapons are a modified version which have the original as a special property
			if ( weapon.original ) {
				weapon = weapon.original;
			}

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

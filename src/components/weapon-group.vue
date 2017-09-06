<script>
import {
	store,
	ADD_WEAPON,
} from "../store.js";
import {
	groupBy,
	mountIntsToText,
	nameSort,
	pluralize,
	weaponClassToInt,
	weaponClassToMountInt,
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

let modalCounter = 0;

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

function tallyMounts(mounts) {
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
}

export default {
	name: "weaponGroup",
	store,
	data () {
		return {};
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
		canAdd() {
			let currentWeaponCount = this.$store.state.currentShip.weapons[this.arc].length;
			let maxWeaponCount = this.getMaxWeapons();

			return currentWeaponCount < maxWeaponCount;
		},
		costOfExtraMounts() {
			let costs = this.getExtraMountCosts();
			let extraMounts = this.getExtraMounts();

			return (extraMounts.total * costs.newMount)
				+ (extraMounts.heavyOrBetter * costs.heavy)
				+ (extraMounts.capital * costs.capital);
		},
		extraMountsText() {
			let costs = this.getExtraMountCosts();
			let extraMounts = this.getExtraMounts();
			let text = [];

			if ( extraMounts.total ) {
				let cost = extraMounts.total * costs.newMount
				text.push(extraMounts.total + " new mount(s) (" + cost + ")");
			}

			if ( extraMounts.heavyOrBetter ) {
				let cost = extraMounts.heavyOrBetter * costs.heavy
				text.push(extraMounts.heavyOrBetter + " heavy upgrade(s) (" + cost + ")");
			}

			if ( extraMounts.capital ) {
				let cost = extraMounts.capital * costs.capital
				text.push(extraMounts.capital + " capital upgrade(s) (" + cost + ")");
			}

			return text.join("; ");
		},
		getExtraMounts() {
			var included = tallyMounts(this.getFrameMounts());
			var used = tallyMounts(this.getUsedMounts());

			let total = Math.max(0, used.total - included.total);
			let heavyOrBetter = Math.max(0, used.heavyOrBetter - included.heavyOrBetter);
			let capital = Math.max(0, used.capital - included.capital);

			return {
				total,
				heavyOrBetter,
				capital,
			};
		},
		getExtraMountCosts() {
			let costs = {
				newMount: 3,
				heavy: 4,
				capital: 5,
			};

			if ( this.arc === "turret" ) {
				costs = {
					newMount: 5,
					heavy: 6,
					capital: 99999,
				};
			}

			return costs;
		},
		getFrameMounts() {
			return this.$store.state.currentShip.frame.mounts[this.arc] || [];
		},
		getFrameMountsText() {
			return mountIntsToText(this.getFrameMounts());
		},
		getMaxWeapons() {
			let size = this.$store.state.currentShip.frame.size;

			if ( size.match(/Tiny|Small/) ) {
				return 2;
			}

			if ( size.match(/Medium|Large/) ) {
				return 3;
			}

			return 4;
		},
		getUsedMounts() {
			let weapons = this.$store.state.currentShip.weapons[this.arc];
			let mounts = [];
			weapons.forEach(weapon => mounts.push(weaponClassToMountInt[weapon.class]));
			return mounts;
		},
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
			<div class="weapon-group--frame-mounts">
				Included mounts: {{ getFrameMountsText() }}
			</div>

			<div
				v-if="costOfExtraMounts() > 0"
				class="weapon-group--extra-mounts">
				Extras: {{ extraMountsText() }}
				Total cost: {{ costOfExtraMounts() }}
			</div>

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
				:disabled="!canAdd()"
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

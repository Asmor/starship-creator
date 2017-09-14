<script>
import {
	store,
	ADD_WEAPON,
} from "../store.js";
import {
	groupBy,
	mountIntsToText,
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

export default {
	name: "weaponGroup",
	store,
	data () {
		return {};
	},
	computed: {
		selectedWeapons: function () {
			// Sort modifies the original array, so we need to slice to get a new array to sort
			return this.$store.state.currentShip.weapons[this.arc];
		},
		selectedFrame: function () {
			return this.$store.state.currentShip.frame;
		},
	},
	methods: {
		canAdd() {
			let maxWeaponCount = this.getMaxWeapons();
			let currentWeaponCount = this.selectedWeapons.length;

			this.selectedWeapons.forEach(weapon => {
				// Linked weapons are actually taking up two slots
				if ( weapon.linked ) {
					currentWeaponCount++;
				}
			});

			return currentWeaponCount < maxWeaponCount;
		},
		costOfExtraMounts() {
			return this.$store.getters.costOfExtraMounts(this.arc);
		},
		extraMountsText() {
			let costs = this.$store.getters.extraMountCosts(this.arc);
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
			return this.$store.getters.extraMounts(this.arc);
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
			return this.$store.getters.usedMounts(this.arc);
		},
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

		&:hover {
			background-color: #ccc;
			cursor: pointer;
		}
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

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
		addWeapon(weapon) {
			this.$store.dispatch(ADD_WEAPON, { weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
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
			>
				<span class="weapon-group--weapon-title">{{ weapon.name }}</span>
				<span class="weapon-group--weapon-type">{{ weapon.class }} {{ weapon.type }}</span>
				<span class="weapon-group--weapon-description">{{ weaponText(weapon) }}</span>
			</div>

			<b-button
				variant="primary"
				v-b-modal="modalId"
				:disabled="selectedWeapons.length >= 3"
			>Add weapon</b-button>
		</single-item>

		<b-modal
			:id="modalId"
			class="weapon-group-modal"
			:ref="modalId"
			title="Choose weapon"
		>
			<b-tabs pills>
				<b-tab
					v-for="(weaponsOfClass, className, index) in weaponsByClass"
					:key="index"
					:title="className"
				>
					<b-tabs pills>
						<b-tab
							v-for="(weaponsOfType, weaponType, typeIndex) in weaponsOfClass"
							:key="typeIndex"
							:title="weaponType"
						>
							<table class="weapon-group-modal--table">
								<thead>
									<tr class="weapon-group-modal--header">
										<td class="weapon-group-modal--column__centered">
											Range
										</td>
										<td
											v-if="weaponType === 'Tracking'"
											class="weapon-group-modal--column__centered"
										>
											Speed
										</td>
										<td class="weapon-group-modal--column__centered">
											Damage
										</td>
										<td class="weapon-group-modal--column__centered">
											PCU
										</td>
										<td class="weapon-group-modal--column__centered">
											Cost
										</td>
										<td>
											Special Properties
										</td>
									</tr>
								</thead>
								<tbody
									v-for="weapon in weaponsOfType"
									class="weapon-group-modal--body"
									@click="addWeapon(weapon)"
								>
										<!-- :class="{
											'weapon-group-modal--body__selected': selectedItem.name === item.name,
										}" -->
										<!-- @click="chooseItem(item)" -->
									<tr>
										<td
											class="weapon-group-modal--weapon-name"
											:colspan="(weaponType === 'Tracking') ? 6 : 5"
										>
											{{ weapon.name }}
										</td>
									</tr>
									<tr>
										<td class="weapon-group-modal--column__centered">
											{{ weapon.range }}
										</td>
										<td
											v-if="weaponType === 'Tracking'"
											class="weapon-group-modal--column__centered"
										>
											{{ weapon.speed }}
										</td>
										<td class="weapon-group-modal--column__centered">
											{{ weapon.damage }}
										</td>
										<td class="weapon-group-modal--column__centered">
											{{ weapon.pcu }}
										</td>
										<td class="weapon-group-modal--column__centered">
											{{ weapon.cost }}
										</td>
										<td>
											{{ weapon.specialProperties }}
										</td>
									</tr>
								</tbody>
							</table>
						</b-tab>
					</b-tabs>
				</b-tab>
			</b-tabs>
			<div slot="modal-footer"></div>
		</b-modal>
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

.weapon-group-modal {
	.weapon-group-modal--table {
		width: 100%;
	}

	.weapon-group-modal--header,
	.weapon-group-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.weapon-group-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.weapon-group-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.weapon-group-modal--body__selected {
			background-color: #dfd;
		}

		&.weapon-group-modal--body__disabled {
			background-color: inherit;
			cursor: not-allowed;
			color: #ccc;
		}
	}

	.weapon-group-modal--weapon-name {
		font-weight: bold;
	}

	.weapon-group-modal--column__centered {
		text-align: center;
	}
}

</style>

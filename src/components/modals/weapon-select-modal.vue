<script>
import {
	store,
	ADD_WEAPON,
} from "../../store.js";
import weapons from "../../data/weapons.json";
import {
	groupBy,
	nameSort,
	weaponClassToInt,
	rangeToInt,
	sizeToInt,
} from "../../util.js";

import {
	registerModal, 
	WEAPON_SELECT_MODAL, 
} from "../../modal-handler.js";

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
	name: "weaponSelectModal",
	store,
	data () {
		return {
			arc: null,
			modalId: "weapon-select-modal",
			weaponClasses: "Light Heavy Capital".split(" "),
			weaponTypes: "Direct-fire Tracking".split(" "),
		};
	},
	computed: {},
	mounted: function () {
		registerModal({
			modalId: WEAPON_SELECT_MODAL,
			opener: (args) => {
				this.arc = args.arc;
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		addWeapon(weapon) {
			this.$store.dispatch(ADD_WEAPON, { weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
		},
		allowedClasses() {
			let shipSizeInt = sizeToInt[this.$store.state.currentShip.frame.size]

			return this.weaponClasses
				.filter(weaponClass => {
					// Turrets can't have capital weapons
					if ( this.arc === "turret" && weaponClass === "Capital" ) {
						return false;
					}

					return weaponClassToInt[weaponClass] <= shipSizeInt;
				});
		},
		getWeapons({ weaponClass, type }) {
			let byClass = weaponsByClass[weaponClass] || {};
			return byClass[type];
		},
	},
	components: {},
};
</script>

<template>
	<div class="weapon-select">
		<b-modal
			:id="modalId"
			class="weapon-select-modal"
			:ref="modalId"
			title="Choose weapon"
		>
			<b-tabs pills>
				<b-tab
					v-for="(weaponClass, index) in allowedClasses()"
					:key="index"
					:title="weaponClass"
				>
					<b-tabs pills>
						<b-tab
							v-for="(type, typeIndex) in weaponTypes"
							:key="typeIndex"
							:title="type"
						>
							<table class="weapon-select-modal--table">
								<thead>
									<tr class="weapon-select-modal--header">
										<td class="weapon-select-modal--column__centered">
											Range
										</td>
										<td
											v-if="type === 'Tracking'"
											class="weapon-select-modal--column__centered"
										>
											Speed
										</td>
										<td class="weapon-select-modal--column__centered">
											Damage
										</td>
										<td class="weapon-select-modal--column__centered">
											PCU
										</td>
										<td class="weapon-select-modal--column__centered">
											Cost
										</td>
										<td>
											Special Properties
										</td>
									</tr>
								</thead>
								<tbody
									v-for="weapon in getWeapons({ weaponClass, type })"
									class="weapon-select-modal--body"
									@click="addWeapon(weapon)"
								>
									<tr>
										<td
											class="weapon-select-modal--weapon-name"
											:colspan="(type === 'Tracking') ? 6 : 5"
										>
											{{ weapon.name }}
										</td>
									</tr>
									<tr>
										<td class="weapon-select-modal--column__centered">
											{{ weapon.range }}
										</td>
										<td
											v-if="type === 'Tracking'"
											class="weapon-select-modal--column__centered"
										>
											{{ weapon.speed }}
										</td>
										<td class="weapon-select-modal--column__centered">
											{{ weapon.damage }}
										</td>
										<td class="weapon-select-modal--column__centered">
											{{ weapon.pcu }}
										</td>
										<td class="weapon-select-modal--column__centered">
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
.weapon-select-modal {
	.weapon-select-modal--table {
		width: 100%;
	}

	.weapon-select-modal--header,
	.weapon-select-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.weapon-select-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.weapon-select-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.weapon-select-modal--body__selected {
			background-color: #dfd;
		}

		&.weapon-select-modal--body__disabled {
			background-color: inherit;
			cursor: not-allowed;
			color: #ccc;
		}
	}

	.weapon-select-modal--weapon-name {
		font-weight: bold;
	}

	.weapon-select-modal--column__centered {
		text-align: center;
	}
}

</style>

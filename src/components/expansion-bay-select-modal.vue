<script>
import {
	store,
	ADD_EXPANSION_BAY,
} from "../store.js";
import expansionBays from "../data/expansion-bays.json";
import {
	expansionBayCalculations,
	nameSort,
	sizeToInt,
} from "../util.js";

import {
	registerModal, 
	EXPANSION_BAY_SELECT_MODAL, 
} from "../modal-handler.js";

export default {
	name: "expansionBaySelectModal",
	store,
	data () {
		return {
			expansionBays,
			modalId: "expansion-bay-select-modal",
		};
	},
	computed: {
		maxSlots: expansionBayCalculations.maxSlots,
		remainingSlots: expansionBayCalculations.remainingSlots,
		selectedExpansionBays: expansionBayCalculations.selectedExpansionBays,
		usedSlots: expansionBayCalculations.usedSlots,
	},
	mounted: function () {
		registerModal({
			modalId: EXPANSION_BAY_SELECT_MODAL,
			opener: () => {
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		addExpansionBay(expansionBay) {
			if ( this.expansionBayAllowed(expansionBay) ) {
				this.$store.dispatch(ADD_EXPANSION_BAY, expansionBay);
				this.$refs[this.modalId].hide();
			}
		},
		expansionBayAllowed(expansionBay) {
			if ( this.remainingSlots < expansionBay.bays ) {
				return false;
			}

			let shipSizeInt = sizeToInt[this.$store.state.currentShip.frame.size];
			if ( sizeToInt[expansionBay.minSize] > shipSizeInt ) {
				return false;
			}

			return true;
		},
	},
	components: {},
};
</script>

<template>
	<div class="expansion-bay-select">
		<b-modal
			:id="modalId"
			class="expansion-bay-select-modal"
			:ref="modalId"
			title="Choose expansion bay"
		>
			<table class="expansion-bay-select-modal--table">
				<thead>
					<tr class="expansion-bay-select-modal--header">
						<td>
							Name
						</td>
						<td>
							Min. Ship Size
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							Bays
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							PCU
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							Cost
						</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="expansionBay in expansionBays"
						class="expansion-bay-select-modal--body"
						:class="{ 'expansion-bay-select-modal--body__disabled': !expansionBayAllowed(expansionBay) }"
						@click="addExpansionBay(expansionBay)"
					>
						<td>
							{{ expansionBay.name }}
						</td>
						<td>
							{{ expansionBay.minSize }}
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							{{ expansionBay.bays }}
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							{{ expansionBay.pcu }}
						</td>
						<td class="expansion-bay-select-modal--column__centered">
							{{ expansionBay.cost }}
						</td>
					</tr>
				</tbody>
			</table>
			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.expansion-bay-select-modal {
	.expansion-bay-select-modal--table {
		width: 100%;
	}

	.expansion-bay-select-modal--header,
	.expansion-bay-select-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.expansion-bay-select-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.expansion-bay-select-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.expansion-bay-select-modal--body__selected {
			background-color: #dfd;
		}

		&.expansion-bay-select-modal--body__disabled {
			background-color: inherit;
			cursor: not-allowed;
			color: #ccc;
		}
	}

	.expansion-bay-select-modal--column__centered {
		text-align: center;
	}
}
</style>

<script>
import { store } from "../store.js";

import { expansionBayCalculations } from "../util.js";

import {
	openModal,
	EXPANSION_BAY_OPTIONS_MODAL,
	EXPANSION_BAY_SELECT_MODAL,
} from "../modal-handler.js";

import singleItem from "./single-item.vue";

export default {
	name: "expansionBays",
	store,
	data: function () {
		return {};
	},
	computed: {
		maxSlots: expansionBayCalculations.maxSlots,
		remainingSlots: expansionBayCalculations.remainingSlots,
		selectedExpansionBays: expansionBayCalculations.selectedExpansionBays,
		usedSlots: expansionBayCalculations.usedSlots,
	},
	methods: {
		getExpansionBayText(expansionBay) {
			let parts = [];
			let { bays, pcu, cost } = expansionBay;

			if ( bays > 1 ) {
				parts.push(bays + " bays");
			}

			parts.push("PCU " + pcu);
			parts.push("Cost " + cost);

			return parts.join("; ");
		},
		showExpansionBayOptionsModal(expansionBay) {
			openModal({ modalId: EXPANSION_BAY_OPTIONS_MODAL, args: { expansionBay } });
		},
		showExpansionBaySelectModal() {
			openModal({ modalId: EXPANSION_BAY_SELECT_MODAL });
		},
	},
	components: {
		singleItem,
	},
}
</script>

<template>
	<div class="expansion-bays">
		<single-item
			title="Expansion bays"
			no-rollover="true"
		>
			Slots available: {{ remainingSlots }} / {{ maxSlots }}

			<div
				class="expansion-bays--expansion-bay"
				v-for="expansionBay in selectedExpansionBays"
				@click="showExpansionBayOptionsModal(expansionBay)"
			>
				<span class="expansion-bays--expansion-bay-title">{{ expansionBay.name }}</span>
				<span class="expansion-bays--expansion-bay-description">{{ getExpansionBayText(expansionBay) }}</span>
			</div>

			<b-button
				variant="primary"
				@click="showExpansionBaySelectModal()"
				:disabled="remainingSlots <= 0"
			>Add expansion bay</b-button>
		</single-item>
	</div>
</template>

<style lang="scss">
.expansion-bays {
	.expansion-bays--expansion-bay {
		padding: 5px 0;

		&:hover {
			background-color: #ccc;
			cursor: pointer;
		}
	}

	.expansion-bays--expansion-bay-title {
		font-weight: bold;
	}
	
	.expansion-bays--expansion-bay-description {
		display: block;
		padding-left: 10px;
	}
}
</style>

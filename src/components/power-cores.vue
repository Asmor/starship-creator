<script>
import { store } from "../store.js";

import {
	openModal,
	POWER_CORE_OPTIONS_MODAL,
	POWER_CORE_SELECT_MODAL,
} from "../modal-handler.js";

import singleItem from "./single-item.vue";

export default {
	name: "powerCores",
	store,
	data: function () {
		return {};
	},
	computed: {
		maxSlots: function () {
			let total = 1;

			this.$store.state.currentShip.expansionBays.forEach(expansionBay => {
				if ( expansionBay.extraPowerCores ) {
					total += expansionBay.extraPowerCores;
					console.log("Got an extra core! Total: ", total);
				}
			});

			return total;
		},
		selectedPowerCores: function () {
			return this.$store.state.currentShip.powerCores;
		},
		usedSlots: function () {
			return this.selectedPowerCores.length;
		},
		remainingSlots: function () {
			return this.maxSlots - this.usedSlots;
		},
	},
	methods: {
		showPowerCoreOptionsModal(powerCore) {
			openModal({ modalId: POWER_CORE_OPTIONS_MODAL, args: { powerCore } });
		},
		showPowerCoreSelectModal() {
			openModal({ modalId: POWER_CORE_SELECT_MODAL });
		},
	},
	components: {
		singleItem,
	},
}
</script>

<template>
	<div class="power-cores">
		<single-item
			title="Power cores"
			no-rollover="true"
		>
			Power cores available: {{ remainingSlots }} / {{ maxSlots }}

			<div
				class="power-cores--power-core"
				v-for="powerCore in selectedPowerCores"
				@click="showPowerCoreOptionsModal(powerCore)"
			>
				<span class="power-cores--power-core-title">{{ powerCore.name }}</span>
				<span class="power-cores--power-core-description">
					PCU {{ powerCore.pcu }};
					Cost {{ powerCore.cost }}
				</span>
			</div>

			<b-button
				variant="primary"
				@click="showPowerCoreSelectModal()"
				:disabled="remainingSlots <= 0"
			>Add power core</b-button>
		</single-item>
	</div>
</template>

<style lang="scss">
.power-cores {
	.power-cores--power-core-title {
		font-weight: bold;
	}
	
	.power-cores--power-core-description {
		display: block;
		padding-left: 10px;
	}
}
</style>

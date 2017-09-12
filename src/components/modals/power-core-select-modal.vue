<script>
import {
	store,
	ADD_POWER_CORE,
} from "../../store.js";
import powerCores from "../../data/power-cores.json";
import {
	nameSort,
	sizeToInt,
} from "../../util.js";

import {
	registerModal, 
	POWER_CORE_SELECT_MODAL, 
} from "../../modal-handler.js";

export default {
	name: "powerCoreSelectModal",
	store,
	data () {
		return {
			powerCores,
			modalId: "power-core-select-modal",
		};
	},
	computed: {
		availablePowerCores: function () {
			let size = this.$store.state.currentShip.frame.size;
			return powerCores.filter(powerCore => powerCore.sizes[size]);
		},
	},
	mounted: function () {
		registerModal({
			modalId: POWER_CORE_SELECT_MODAL,
			opener: () => {
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		addPowerCore(expansionBay) {
			this.$store.dispatch(ADD_POWER_CORE, expansionBay);
			this.$refs[this.modalId].hide();
		},
	},
	components: {},
};
</script>

<template>
	<div class="expansion-bay-select">
		<b-modal
			:id="modalId"
			class="power-core-select-modal"
			:ref="modalId"
			title="Choose expansion bay"
		>
			<table class="power-core-select-modal--table">
				<thead>
					<tr class="power-core-select-modal--header">
						<td>
							Name
						</td>
						<td class="power-core-select-modal--column__centered">
							PCU
						</td>
						<td class="power-core-select-modal--column__centered">
							Cost
						</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="powerCore in availablePowerCores"
						class="power-core-select-modal--body"
						@click="addPowerCore(powerCore)"
					>
						<td>
							{{ powerCore.name }}
						</td>
						<td class="power-core-select-modal--column__centered">
							{{ powerCore.pcu }}
						</td>
						<td class="power-core-select-modal--column__centered">
							{{ powerCore.cost }}
						</td>
					</tr>
				</tbody>
			</table>
			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.power-core-select-modal {
	.power-core-select-modal--table {
		width: 100%;
	}

	.power-core-select-modal--header,
	.power-core-select-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.power-core-select-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.power-core-select-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.power-core-select-modal--body__selected {
			background-color: #dfd;
		}

		&.power-core-select-modal--body__disabled {
			background-color: inherit;
			cursor: not-allowed;
			color: #ccc;
		}
	}

	.power-core-select-modal--column__centered {
		text-align: center;
	}
}
</style>

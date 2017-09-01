<script>
import { store, SET_POWER_CORE } from "../store.js";
import powerCores from "../data/power-cores.json";
import singleItem from "./single-item.vue";

export default {
	name: "selectPowerCore",
	store,
	data () {
		return {};
	},
	computed: {
		availablePowerCores: function () {
			let size = this.$store.state.currentShip.frame.size;
			return powerCores.filter(core => core.sizes[size]);
		},
		selectedPowerCore: function () {
			return this.$store.state.currentShip.powerCore;
		},
	},
	methods: {
		choosePowerCore(powerCore) {
			this.$store.dispatch(SET_POWER_CORE, powerCore);
		},
	},
	components: {
		singleItem,
	},
};
</script>

<template>
	<div class="select-power-core">
		<single-item
			v-if="selectedPowerCore"
			title="Power Core"
			v-b-modal.power-core-modal
		>
			{{ selectedPowerCore.name }}; PCU {{ selectedPowerCore.pcu }}; Cost {{ selectedPowerCore.cost }}
		</single-item>

		<b-modal
			id="power-core-modal"
			class="power-core-modal"
			ref="power-core-modal"
			title="Select a power core"
		>
			<table class="power-core-modal--table">
				<thead>
					<tr class="power-core-modal--header">
						<td>Power core</td>
						<td>PCU</td>
						<td>Cost</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="powerCore in availablePowerCores"
						class="power-core-modal--body"
						:class="{ 'power-core-modal--body__selected': selectedPowerCore.name === powerCore.name }"
						@click="choosePowerCore(powerCore)"
					>
						<td>{{ powerCore.name }}</td>
						<td>{{ powerCore.pcu }}</td>
						<td>{{ powerCore.cost }}</td>
					</tr>
				</tbody>
			</table>
			</b-tabs>
			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.select-power-core {
	.select-power-core--frame-option {
		cursor: pointer;
		padding: 10px;

		&:hover {
			background-color: #ddd;
		}

		&.select-power-core--frame-option__active {
			background-color: #cfc;
		}
	}
}

.power-core-modal {
	.power-core-modal--table {
		width: 100%;
	}

	.power-core-modal--header,
	.power-core-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.power-core-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.power-core-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.power-core-modal--body__selected {
			background-color: #dfd;
		}
	}
}
</style>

<script>
import {
	store,
	REMOVE_POWER_CORE,
} from "../../store.js";

import {
	registerModal, 
	POWER_CORE_OPTIONS_MODAL,
} from "../../modal-handler.js";

export default {
	name: "powerCoreOptionsModal",
	store,
	data () {
		return {
			powerCore: {},
			modalId: "power-core-options-modal",
		};
	},
	computed: {},
	mounted: function () {
		registerModal({
			modalId: POWER_CORE_OPTIONS_MODAL,
			opener: (args) => {
				this.powerCore = args.powerCore;
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		removePowerCore() {
			this.$store.dispatch(REMOVE_POWER_CORE, this.powerCore );
			this.$refs[this.modalId].hide();
		},
	},
	components: {},
};
</script>

<template>
	<div class="power-core-options">
		<b-modal
			:id="modalId"
			class="power-core-options-modal"
			:ref="modalId"
			:title="powerCore.name"
		>
			<div class="power-core-options-modal--button">
				<b-button
					variant="danger"
					@click="removePowerCore()"
				>Remove</b-button>
			</div>

			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.power-core-options-modal {
	.power-core-options-modal--button {
		padding: 10px;
	}
}
</style>

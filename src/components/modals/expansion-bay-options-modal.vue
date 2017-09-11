<script>
import {
	store,
	REMOVE_EXPANSION_BAY,
} from "../../store.js";

import {
	registerModal, 
	EXPANSION_BAY_OPTIONS_MODAL,
} from "../../modal-handler.js";

export default {
	name: "expansionBayOptionsModal",
	store,
	data () {
		return {
			expansionBay: {},
			modalId: "expansion-bay-options-modal",
		};
	},
	computed: {},
	mounted: function () {
		registerModal({
			modalId: EXPANSION_BAY_OPTIONS_MODAL,
			opener: (args) => {
				this.expansionBay = args.expansionBay;
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		removeExpansionBay() {
			this.$store.dispatch(REMOVE_EXPANSION_BAY, { expansionBay: this.expansionBay });
			this.$refs[this.modalId].hide();
		},
	},
	components: {},
};
</script>

<template>
	<div class="expansion-bay-options">
		<b-modal
			:id="modalId"
			class="expansion-bay-options-modal"
			:ref="modalId"
			:title="expansionBay.name"
		>
			<div class="expansion-bay-options-modal--button">
				<b-button
					variant="danger"
					@click="removeExpansionBay()"
				>Remove</b-button>
			</div>

			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.expansion-bay-options-modal {
	.expansion-bay-options-modal--button {
		padding: 10px;
	}
}
</style>

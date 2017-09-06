<script>
import {
	store,
	LINK_WEAPON,
	REMOVE_WEAPON,
} from "../store.js";

import {
	registerModal, 
	WEAPON_OPTIONS_MODAL,
} from "../modal-handler.js";

export default {
	name: "weaponOptionsModal",
	store,
	data () {
		return {
			arc: "",
			weapon: {},
			modalId: "weapon-options-modal",
		};
	},
	computed: {},
	mounted: function () {
		registerModal({
			modalId: WEAPON_OPTIONS_MODAL,
			opener: (args) => {
				this.arc = args.arc;
				this.weapon = args.weapon;
				this.$refs[this.modalId].show();
			},
		});
	},
	methods: {
		linkWeapon() {
			console.warn("TO DO: IMPLEMENT REMOVE AND LINK!");
			return;
			this.$store.dispatch(LINK_WEAPON, { weapon: this.weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
		},
		removeWeapon() {
			this.$store.dispatch(REMOVE_WEAPON, { weapon: this.weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
			return;
		},
	},
	components: {},
};
</script>

<template>
	<div class="weapon-options">
		<b-modal
			:id="modalId"
			class="weapon-options-modal"
			:ref="modalId"
			:title="weapon.name + ' (' + arc + ')'"
		>
			<div class="weapon-options-modal--button">
				<b-button
					variant="primary"
					@click="linkWeapon()"
				>Link</b-button>
				(requires two identical weapons)
			</div>
			<div class="weapon-options-modal--button">
				<b-button
					variant="danger"
					@click="removeWeapon()"
				>Remove</b-button>
			</div>

			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.weapon-options-modal {
	.weapon-options-modal--button {
		padding: 10px;
	}
}

</style>

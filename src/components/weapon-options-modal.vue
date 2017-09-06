<script>
import {
	store,
	LINK_WEAPON,
	REMOVE_WEAPON,
	UNLINK_WEAPON,
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
		canLink() {
			if ( !this.arc ) {
				return false;
			}

			let weapons = this.$store.state.currentShip.weapons[this.arc];
			let matchingWeapons = weapons.reduce((sum, weapon) => {
				if ( weapon.name === this.weapon.name ) {
					sum++;
				}

				return sum;
			}, 0);

			return matchingWeapons >= 2;
		},
		isLinked(weapon) {
			var linked = this.$store.state.currentShip.weaponLinks[this.arc];
			return !!(linked && linked.name === weapon.name);
		},
		linkWeapon() {
			this.$store.dispatch(LINK_WEAPON, { weapon: this.weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
		},
		removeWeapon() {
			this.$store.dispatch(REMOVE_WEAPON, { weapon: this.weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
		},
		unlinkWeapon() {
			this.$store.dispatch(UNLINK_WEAPON, { weapon: this.weapon, arc: this.arc });
			this.$refs[this.modalId].hide();
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
			<div
				class="weapon-options-modal--button"
				v-if="!isLinked(weapon)"
			>
				<b-button
					variant="primary"
					@click="linkWeapon()"
					:disabled="!canLink()"
				>Link</b-button> Cost: {{ Math.floor(weapon.cost / 2) }}
				(requires two identical weapons)
			</div>

			<div
				class="weapon-options-modal--button"
				v-if="isLinked(weapon)"
			>
				<b-button
					variant="primary"
					@click="unlinkWeapon()"
				>Unlink</b-button>
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

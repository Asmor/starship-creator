<script>
import { store } from "../store.js";
import { sizeToInt } from "../util.js";

import singleItem from "./single-item.vue";

let modalCounter = 0;

export default {
	name: "singleSelector",
	store,
	data () {
		let addendaAsterisks = "*";
		return {
			addenda: this.columns.reduce(function (acc, col) {
				if ( col.addendum ) {
					acc[col.key] = { note: addendaAsterisks, text: col.addendum };
					addendaAsterisks += "*";
				}

				return acc;
			}, {}),
			modalId: "single-selector-modal" + modalCounter++,
		};
	},
	computed: {
		availableItems: function () {
			if ( this.itemFilter ) {
				return this.items.filter(this.itemFilter.bind(null, this.$store.state.currentShip));
			}

			return this.items;
		},
		selectedText: function () {
			let parts = [];
			let item = this.selectedItem;

			this.columns.forEach(col => {
				let value = this.getValue({ item, col });

				if ( col.hideIfZero && this.isZero(item[col.key]) ) {
					return;
				}

				let part = col.name + " " + value;

				// We don't label the name
				if ( col.key === "name" ) {
					part = value;
				}

				if ( col.addendum ) {
					part += " (" + col.addendum + ")";
				}

				parts.push(part);
			});

			return parts.join("; ");
		},
		selectedItem: function () {
			return this.$store.state.currentShip[this.shipComponentKey];
		},
	},
	methods: {
		chooseItem(item) {
			if ( this.removeable && this.isZero(item.cost) ) {
				this.$store.dispatch(this.selectAction, false);
				this.$refs[this.modalId].hide();
			} else if ( this.itemAllowed(item) ) {
				this.$store.dispatch(this.selectAction, item);
				this.$refs[this.modalId].hide();
			}
		},
		getValue({ item, col }) {
			let value = item[col.key];

			if ( col.multiplyBySize ) {
				let size = this.$store.state.currentShip.frame.size;
				let multiplier = sizeToInt[size];

				value *= multiplier;
			}

			return value;
		},
		isZero(thing) {
			return (
				thing === "0"
				|| thing === "+0"
				|| thing === 0
			);
		},
		itemAllowed(item) {
			if ( !this.itemDisabled ) {
				return true;
			}

			return this.itemDisabled(this.$store.state.currentShip, item);
		},
	},
	props: [
		"columns",
		"itemDisabled",
		"itemFilter",
		"items",
		"removeable",
		"selectAction",
		"selectTitle",
		"shipComponentKey",
		"title",
	],
	components: {
		singleItem,
	},
};
</script>

<template>
	<div class="single-selector">
		<div
			v-if="$store.state.currentShip.frame && !selectedItem"
			class="single-selector--nothing-selected"
		>
			<b-button
				variant="primary"
				v-b-modal="modalId"
			>{{ selectTitle }}</b-button>
		</div>

		<single-item
			v-if="selectedItem"
			:title="title"
			v-b-modal="modalId"
		>
			{{ selectedText }}
		</single-item>

		<b-modal
			:id="modalId"
			class="single-selector-modal"
			:ref="modalId"
			:title="selectTitle"
		>
			<table class="single-selector-modal--table">
				<thead>
					<tr class="single-selector-modal--header">
						<td
							v-for="col in columns"
							:class="{ 'single-selector-modal--column__centered': col.center }"
						>
							{{ col.name }}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in availableItems"
						class="single-selector-modal--body"
						:class="{
							'single-selector-modal--body__selected': selectedItem.name === item.name,
							'single-selector-modal--body__disabled': !itemAllowed(item),
						}"
						@click="chooseItem(item)"
					>
						<td
							v-for="col in columns"
							:class="{ 'single-selector-modal--column__centered': col.center }"
						>
							<span v-if="!col.hideIfZero || !isZero(item[col.key])">
								{{ getValue({ item, col }) }}{{ addenda[col.key] && addenda[col.key].note }}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="single-selector-modal--addenda">
				<div
					v-for="(addendum, key) in addenda"
					class="single-selector-modal--addendum"
				>
					{{ addendum.note }}{{ addendum.text }}
				</div>
			</div>
			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.single-selector {
	height: 100%;

	.single-selector--nothing-selected {
		border: 2px solid #ccc;
		padding: 5px;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.single-selector--frame-option {
		cursor: pointer;
		padding: 10px;

		&:hover {
			background-color: #ddd;
		}

		&.single-selector--frame-option__active {
			background-color: #cfc;
		}
	}
}

.single-selector-modal {
	.single-selector-modal--table {
		width: 100%;
	}

	.single-selector-modal--header,
	.single-selector-modal--body {
		& > td {
			padding: 5px;
		}
	}

	.single-selector-modal--header {
		font-weight: bold;
		background-color: #000;
		color: #fff;
	}

	.single-selector-modal--body {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

		&.single-selector-modal--body__selected {
			background-color: #dfd;
		}

		&.single-selector-modal--body__disabled {
			background-color: inherit;
			cursor: not-allowed;
			color: #ccc;
		}
	}

	.single-selector-modal--column__centered {
		text-align: center;
	}
}
</style>

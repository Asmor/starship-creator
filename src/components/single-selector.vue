<script>
import { store } from "../store.js";
import singleItem from "./single-item.vue";

let modalCounter = 0;

export default {
	name: "singleSelector",
	store,
	data () {
		return {
			modalId: "single-selector-modal" + modalCounter,
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
				let part = col.name + " " + item[col.key];

				// We don't label the name
				if ( col.key === "name" ) {
					part = item[col.key];
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
			this.$store.dispatch(this.selectAction, item);
		},
	},
	props: [
		"columns",
		"itemFilter",
		"items",
		"modalTitle",
		"selectAction",
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
		<single-item
			v-if="selectedItem"
			:title="title"
			v-b-modal="modalId"
		>
			{{ selectedItem.name }}; PCU {{ selectedItem.pcu }}; Cost {{ selectedItem.cost }}
		</single-item>

		<b-modal
			:id="modalId"
			class="single-selector-modal"
			ref="single-selector-modal"
			:title="modalTitle"
		>
			<table class="single-selector-modal--table">
				<thead>
					<tr class="single-selector-modal--header">
						<td v-for="column in columns">
							{{ column.name }}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in availableItems"
						class="single-selector-modal--body"
						:class="{ 'single-selector-modal--body__selected': selectedItem.name === item.name }"
						@click="chooseItem(item)"
					>
						<td v-for="column in columns">
							{{ item[column.key] }}
						</td>
					</tr>
				</tbody>
			</table>
			</b-tabs>
			<div slot="modal-footer"></div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.single-selector {
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
	}
}
</style>

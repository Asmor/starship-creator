<script>
import { store, SET_FRAME } from "../store.js";
import frames from "../data/frames.json";
import frame from "./frame.vue";
import { groupBy, nameSort } from "../util.js";

const generateMountsText = mounts => {
	let arcs = [];

	["forward", "port", "starboard", "aft", "turret"].forEach(arc => {
		if ( mounts[arc] && mounts[arc].length ) {
			// light = 1, heavy = 2, capital = 3
			let classCounts = [null, 0, 0, 0];
			let classTexts = [];
			mounts[arc].forEach(mount => classCounts[mount]++);

			[
				{ val: 3, text: "capital" },
				{ val: 2, text: "heavy" },
				{ val: 1, text: "light" },
			].forEach(def => {
				if ( classCounts[def.val] ) {
					classTexts.push(classCounts[def.val] + " " + def.text);
				}
			});

			arcs.push(arc + " (" + classTexts.join(", ") + ")");
		}
	});

	return arcs.join(", ");
};

frames.forEach(frame => frame.mountsText = generateMountsText(frame.mounts));

export default {
	name: "selectFrame",
	store,
	data () {
		return {
			frames: frames.sort(nameSort),
			framesBySize: groupBy({
				collection: frames,
				groupKey: "size",
				sortKey: "cost",
			}),
		};
	},
	computed: {
		selectedFrame: function () {
			return this.$store.state.currentShip.frame;
		},
	},
	methods: {
		chooseFrame(frame) {
			this.$store.dispatch(SET_FRAME, frame);
			this.$refs["frames-modal"].hide();
		},
	},
	components: {
		frame,
	},
};
</script>

<template>
	<div class="select-frame">
		<b-button
			v-if="!selectedFrame"
			variant="primary"
			v-b-modal.frames-modal
		>Select a frame</b-button>

		<div
			class="select-frame--frame"
			v-if="selectedFrame"
			v-b-modal.frames-modal
		>
			<frame
				:frame="selectedFrame"
			></frame>
		</div>

		<b-modal
			id="frames-modal"
			ref="frames-modal"
			title="Select a frame"
			class="select-frames--modal"
		>
			<b-tabs pills>
				<b-tab
					v-for="(framesOfSize, sizeName) in framesBySize"
					:title="sizeName"
				>
					<div
						class="select-frame--frame-option"
						:class="{
							'select-frame--frame-option__active': frame.name === selectedFrame.name
						}"
						v-for="frame in framesOfSize"
						@click="chooseFrame(frame)"
					>
						<frame :frame="frame">
						</frame>
					</div>
				</b-tab>
			</b-tabs>
			<div slot="modal-footer">
			</div>
		</b-modal>
	</div>
</template>

<style lang="scss">
.select-frame {
	.select-frame--frame,
	.select-frame--frame-option {
		cursor: pointer;

		&:hover {
			background-color: #ddd;
		}

	}

	.select-frame--frame-option {
		padding: 10px;

		&.select-frame--frame-option__active {
			background-color: #cfc;
		}
	}
}
</style>

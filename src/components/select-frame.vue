<script>
import { store, SET_FRAME } from "../store.js";
import frames from "../data/frames.json";
import frame from "./frame.vue";
import {
	groupBy,
	mountIntsToText,
	nameSort,
	sizeToInt,
} from "../util.js";

const generateMountsText = mounts => {
	let arcs = [];

	["forward", "port", "starboard", "aft", "turret"].forEach(arc => {
		if ( mounts[arc] && mounts[arc].length ) {
			arcs.push(arc + " (" + mountIntsToText(mounts[arc]) + ")");
		}
	});

	return arcs.join(", ");
};

frames.forEach(frame => frame.mountsText = generateMountsText(frame.mounts));

let framesBySize = groupBy({
	collection: frames,
	groupKey: "size",
	sortKey: "cost",
});
window.framesBySize = framesBySize;

export default {
	name: "selectFrame",
	store,
	data () {
		return {
			frames: frames.sort(nameSort),
			frameSizes: [
				"Tiny",
				"Small",
				"Medium",
				"Large",
				"Huge",
				"Gargantuan",
				"Colossal",
			],
			framesBySize,
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
					v-for="(size, index) in frameSizes"
					:key="index"
					:title="size"
				>
					<div
						class="select-frame--frame-option"
						:class="{
							'select-frame--frame-option__active': frame.name === selectedFrame.name
						}"
						v-for="frame in framesBySize[size]"
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

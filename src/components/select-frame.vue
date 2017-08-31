<script>
import frames from "../data/frames.json";
import frame from "./frame.vue";
import { groupBy, nameSort } from "../util.js";

export default {
	name: "selectFrame",
	data () {
		return {
			frames: frames.sort(nameSort),
			framesBySize: groupBy({
				collection: frames,
				groupKey: "size",
				sortKey: "cost",
			}),
			selectedFrame: null,
		};
	},
	components: {
		frame,
	},
};
</script>

<template>
	<div class="select-frame">
		<b-button
			variant="secondary"
			v-b-modal.options-modal
		>Select a frame</b-button>

		<b-modal
			id="options-modal"
			ref="options-modal"
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
						v-for="frame in framesOfSize"
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
</style>

<script>
let maneuverabilityDetails = {
	perfect: { piloting: "+2", turn: 0 },
	good:    { piloting: "+1", turn: 1 },
	average: { piloting: "+0", turn: 2 },
	poor:    { piloting: "-1", turn: 3 },
	clumsy:  { piloting: "-2", turn: 4 },
};

export default {
	name: "frame",
	data() {
		return {
			maneuverabilityDetails,
		};
	},
	props: ["frame"],
};
</script>

<template>
	<div class="frame">
		<div class="frame--header-bar">
			<div class="frame--name">
				{{ frame.name }}
			</div>
			<b-button
				variant="primary"
				class="frame--select-button"
			>Select</b-button>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Size</span>
			<span class="frame--info-value">{{ frame.size }}</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Maneuverability</span>
			<span class="frame--info-value">
				{{ frame.maneuverability }}
				({{ maneuverabilityDetails[frame.maneuverability].piloting }} Piloting, turn {{ maneuverabilityDetails[frame.maneuverability].turn }})
			</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">HP</span>
			<span class="frame--info-value">{{ frame.baseHp }} (increment 5);</span>
			<span class="frame--info-name">DT</span>
			<span class="frame--info-value">{{ frame.damageThreshold ? frame.damageThreshold : "&ndash;" }};</span>
			<span class="frame--info-name">CT</span>
			<span class="frame--info-value">{{ Math.floor(frame.baseHp / 5)}};</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Mounts</span>
			<span class="frame--info-value">{{ frame.mountsText }}</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Expansion Bays</span>
			<span class="frame--info-value">{{ frame.expansionBays }}</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Minimum Crew</span>
			<span class="frame--info-value">{{ frame.minCrew }}</span>
			<span class="frame--info-name">Maximum Crew</span>
			<span class="frame--info-value">{{ frame.maxCrew }}</span>
		</div>
		<div class="frame--info-line">
			<span class="frame--info-name">Cost</span>
			<span class="frame--info-value">{{ frame.cost }}</span>
		</div>
	</div>
</template>

<style lang="scss">
.frame {
	.frame--header-bar {
		background-color: #000;
		color: #fff;
		margin-top: 10px;
		display: flex;
		padding: 10px;
		justify-content: space-between;
		align-items: center;
	}

	.frame--name {
		text-transform: uppercase;
		padding-left: 5px;
		font-weight: bold;
		font-size: 1.2em;
	}

	.frame--info-name {
		font-weight: bold;
	}
}
</style>

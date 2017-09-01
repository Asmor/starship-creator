<template>
	<div id="app" class="app">
		<b-navbar toggleable="md" type="dark" variant="dark" :sticky="true">
			<b-navbar-brand href="#">TODO TITLE GOES HERE</b-navbar-brand>
		</b-navbar>

		<div class="app--section">
			<select-frame></select-frame>
		</div>

		<div class="app--section">
			<select-power-core></select-power-core>
		</div>

	</div>
</template>

<script>
import selectFrame from "./components/select-frame.vue";
import selectPowerCore from "./components/select-power-core.vue";

export default {
	name: 'app',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App'
		}
	},
	components: {
		selectFrame,
		selectPowerCore,
	}
}
</script>

<style lang="scss">
.app {
	.app--section {
		padding: 10px;
	}
}
</style>

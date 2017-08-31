<template>
	<div id="app">
		<b-navbar toggleable="md" type="dark" variant="dark" :sticky="true">
			<b-navbar-brand href="#">TODO TITLE GOES HERE</b-navbar-brand>
		</b-navbar>

		<select-frame></select-frame>
	</div>
</template>

<script>
import selectFrame from "./components/select-frame.vue";

export default {
	name: 'app',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App'
		}
	},
	components: {
		selectFrame,
	}
}
</script>

<style lang="scss">
</style>

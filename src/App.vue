<template>
	<div id="app">
		<top-nav />

		<router-view />
	</div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
export default {
	components: {
		TopNav,
	},
};
</script>
<style lang="scss">
@import "@/assets/scss/style";
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>

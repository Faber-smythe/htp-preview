<template>
	<div class="container">
		<section class="header-site-title">
			<h1 class="title title-font">{{ site }}</h1>
		</section>
		<Immersive :site="site"></Immersive>
	</div>
</template>

<script>
import Immersive from '@/components/Immersive.vue'

export default {
	name: 'PreviewSite',
	components: {
		Immersive,
	},
	data() {
		return {
			site: this.$route.params.site,
		}
	},
	mounted() {},
}
</script>
<style scoped>
.header-site-title {
	margin: 1em;
}
</style>

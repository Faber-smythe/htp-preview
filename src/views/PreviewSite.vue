<template>
	<!--<div class="container">
		<section class="header-site-title">
			<h1 class="title title-font">{{ site }}</h1>
		</section>
		
	</div>-->

	<Immersive :site="site" :immersiveFileName="immersiveFileName" v-if="immersiveFileName"></Immersive>
</template>

<script>
import Immersive from '@/components/Immersive.vue'
import sites from '../data/sites.json'

export default {
	name: 'PreviewSite',
	components: {
		Immersive,
	},
	data() {
		return {
			site: this.$route.params.site,
			immersiveID: this.$route.params.immersive,
			immersiveFileName: null
		}
	},
	mounted() {
		let selectedSite = sites.find(s => {
			return s.site == this.site
		})

		let foundImmersive = selectedSite.immersives.find(immersive => {
			return immersive.id == this.immersiveID
		})

		this.immersiveFileName = foundImmersive.file
	},
}
</script>
<style scoped>
.header-site-title {
	margin: 1em;
}
</style>

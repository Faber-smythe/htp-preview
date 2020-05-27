<template>
	<!--<div class="container">
		<section class="header-site-title">
			<h1 class="title title-font">{{ site }}</h1>
		</section>
		
	</div>-->

	<Immersive :site="site" :linkLabel="linkLabel" :foundImmersive="foundImmersive" v-if="foundImmersive"></Immersive>
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
			site: {},
			linkLabel: this.$route.params.linkLabel,
			immersiveID: this.$route.params.immersive,
			foundImmersive: null
		}
	},
	mounted() {
		let selectedSite = sites.find(s => {
			return s.linkLabel == this.linkLabel
		})
		this.site = selectedSite.site

		this.foundImmersive = selectedSite.immersives.find(immersive => {
			return immersive.id == this.immersiveID
		})

		//this.immersiveFileName = foundImmersive.file
	},
}
</script>
<style scoped>
.header-site-title {
	margin: 1em;
}
</style>

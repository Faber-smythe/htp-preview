<template>
	<div class="container">
		<h1 class="title">{{ site }}</h1>
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

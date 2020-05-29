<template>
	<div
		class="site-tile"
		@mouseover="isOver = true"
		@mouseleave="isOver = false"
		:style="`background-image: url(${coverURL()});`"
	>
		<div
			:class="isMobile ? 'content-site-tile-mobile' : 'content-site-tile'"
			@click="onSiteClick()"
		>
			<h2>{{ $t(site.site) }}</h2>

			<!--<b-icon
				pack="far"
				icon="play-circle"
				size="is-large"
				type="is-white"
				v-if="site.interact"
			>
			</b-icon>-->
			<h3 v-if="site.interact">{{ $t('count_augmented_visits', [site.immersives.length]) }}</h3>
			<h3 v-if="!site.interact">Prochainement</h3>
		</div>
	</div>
</template>

<script>
import { utilsMixin } from '../utils/mixins'

export default {
	name: 'SiteTile',
	mixins: [utilsMixin],
	props: {
		site: Object,
	},
	data() {
		return {
			isOver: false,
		}
	},
	methods: {
		onSiteClick() {
			if (this.site.interact) {
				if (
					this.site.linkLabel == 'chinon' ||
					this.site.linkLabel == 'loches'
				) {
					this.$router.push('/chinon-loches')
				} else {
					this.$router.push(`/${this.site.linkLabel}`)
				}
			}
		},
		coverURL() {
			//return `/img/immersives/${immersive.name}.jpg`
			return this.isOver
				? `/img/sites/${this.site.linkLabel}-over.jpg`
				: `/img/sites/${this.site.linkLabel}.jpg`
		},
	},
}
</script>

<style scoped>
.site-tile {
	min-height: 25rem;
	color: white;
	width: 100%;
	background-size: cover;
	background-position: center;
	display: table;
}

.content-site-tile-mobile {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.3);
	opacity: 1;
}

.content-site-tile {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	opacity: 0;
}

.content-site-tile:hover {
	background-color: rgba(0, 0, 0, 0.3);
	opacity: 1;
}
</style>

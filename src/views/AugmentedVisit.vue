<template>
	<div class="container-fluid">
		<NavigationBar />

		<div
			class="container-fluid"
			style="margin-top: -3.3em; margin-bottom: 1rem;"
		>
			<b-carousel
				v-if="immersives.length > 0"
				:has-drag="true"
				:autoplay="true"
				:pause-hover="false"
			>
				<b-carousel-item v-for="(immersive, i) in immersives" :key="i">
					<span class="image">
						<div
							class="hero-body has-text-centered cover"
							@click="onCarouselClick(immersive)"
							:style="
								`background-image: url(${coverURL(immersive)}); width:100%; 
								`
							"
						>
							<div v-if="isSmartPhone && isLandscape">
								<br />
								<br />
								<h3 class="subtitle title-font">
									{{ $t(immersive.site) }}
								</h3>
								<h1 class="title title-font">
									<a
										:href="
											`/teaser/${immersive.linkLabel}/immersive/${immersive.id}`
										"
										>{{ $t(immersive.name) }}</a
									>
								</h1>
								<span class="title-font"
									><img src="/img/play.png" class="play-btn" /><br />{{
										$t('enter_history')
									}}</span
								>
							</div>
							<div v-if="!isSmartPhone || !isLandscape">
								<br />
								<br />
								<h3 class="subtitle title-font">
									{{ $t(immersive.site) }}
								</h3>
								<h1 class="title title-font">
									<a
										:href="
											`/teaser/${immersive.linkLabel}/immersive/${immersive.id}`
										"
										>{{ $t(immersive.name) }}</a
									>
								</h1>

								<div
									style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%"
								>
									<div
										class="title-font"
										style="text-align: center; color: white;"
									>
										<span style="font-size: 1.5rem;"
											><img src="/img/play.png" class="play-btn" /><br />{{
												$t('enter_history')
											}}</span
										>
									</div>
								</div>
							</div>
						</div>
					</span>
				</b-carousel-item>
			</b-carousel>
		</div>

		<div class="container">
			<div class="header-intro title-font">
				<h3 class="title-font">
					{{ $t('intro_2') }}
				</h3>
			</div>
		</div>

		<section
			class="home-section"
			style="margin-top: 4rem; margin-bottom: 4rem;"
		>
			<div class="container">
				<div class="header-intro title-font background-sceau">
					<h2>
						{{ $t('infos_histovery') }}
					</h2>
					<br /><br />
					<h2>
						{{ $t('infos_histovery_2') }}
					</h2>
				</div>
			</div>
		</section>

		<section class="container-fluid">
			<SitePromo />
		</section>

		<br /><br />

		<section class="home-section social-network">
			<SocialNetwork />
		</section>

		<Footer />
	</div>
</template>

<script>
import sites from '../data/sites.json'
import NavigationBar from '../components/NavigationBar'
import SocialNetwork from '../components/SocialNetwork'
import Footer from '../components/Footer'
import SitePromo from '../components/SitePromo'

import { utilsMixin } from '../utils/mixins'

export default {
	name: 'AugmentedVisit',
	mixins: [utilsMixin],
	components: {
		NavigationBar,
		SocialNetwork,
		SitePromo,
		Footer,
	},
	data() {
		return {
			map: null,
			markers: null,
			popups: null,
			selectedSite: null,
			activeTab: 0,
			mapLoaded: false,
			immersives: [],
			linkLabel: this.$route.params.linkLabel,
			isPromoVisible: false,
		}
	},
	mounted() {
		this.initCarousel()
	},
	methods: {
		initCarousel() {
			let siteWithImmersives = sites.filter((site) => {
				return (
					site.immersives &&
					site.immersives.length > 0 &&
					site.linkLabel == this.linkLabel
				)
			})

			this.immersives = []
			siteWithImmersives.forEach((swi) => {
				this.immersives = this.immersives.concat(
					swi.immersives.map((immersive) => {
						immersive['linkLabel'] = swi.linkLabel
						return immersive
					})
				)
			})
		},

		// eslint-disable-next-line no-unused-vars
		coverURL(immersive) {
			return `/img/immersives/${immersive.id}.jpg`
			//return `/img/carrousel_place_holder.jpg`
		},
		onCarouselClick(immersive) {
			this.$router.push(
				`/teaser/${immersive.linkLabel}/immersive/${immersive.id}`
			)
		},
	},
}
</script>

<style scoped>
.carousel .subtitle {
	color: white;
}

.carousel {
	height: 100vh;
}

.cover {
	height: 100vh;
	background-size: cover;
	background-position: center;
	box-shadow: inset 0px 0px 140px 60px rgba(0, 0, 0, 0.8);
	cursor: pointer;
	position: relative;
	color: white;
}

.no-margin {
	margin: 0 !important;
	padding: 0 !important;
}

.background-sceau {
	background-image: url('/img/sceau_histovery.png');
	width: 100%;
	height: auto;
	background-size: auto 40%;
	background-repeat: no-repeat;
	background-position: center;
}

.play-btn {
	width: 3.75rem;
	display: inherit;
	opacity: 0.85;
	transition: ease-in-out 0.3s;
}

.play-btn:hover {
	opacity: 1;
	width: 5rem;
}

@media screen and (min-width: 321px) and (max-width: 767px) {
	.background-sceau {
		background-image: url('/img/sceau_histovery.png');
		width: 100%;
		height: auto;
		background-size: auto 20%;
		background-repeat: no-repeat;
		background-position: center;
	}
}

@media screen and (max-width: 320px) {
	.background-sceau {
		background-image: url('/img/sceau_histovery.png');
		width: 100%;
		height: auto;
		background-size: auto 10%;
		background-repeat: no-repeat;
		background-position: center;
	}
}
</style>

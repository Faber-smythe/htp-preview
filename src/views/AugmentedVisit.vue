<template>
	<div class="container-fluid">
		<NavigationBar />
		<section class="section header-section">
			<h1 class="title title-font">
				<img
					class="main-logo"
					src="/img/logos/logo_histopad.png"
					alt="HistoPad"
				/>
			</h1>
		</section>

		<section class="home-section">
			<div class="container">
				<div class="header-intro title-font">
					<h1>
						{{ $t('intro') }}
					</h1>
					<br />

					<h3>
						{{ $t('intro_2') }}
					</h3>
				</div>
			</div>
		</section>

		<div class="container-fluid" style="margin-top: 1rem; margin-bottom: 1rem;">
			<b-carousel v-if="immersives.length > 0" :has-drag="true">
				<b-carousel-item v-for="(immersive, i) in immersives" :key="i">
					<span class="image">
						<div
							class="hero-body has-text-centered cover"
							:style="
								`background-image: url(${coverURL(immersive)}); width:100%; 
								background-size:cover;
								background-position: center;
								box-shadow: inset 0px 0px 70px 30px rgba(0,0,0,0.8);`
							"
						>
							<h3 class="subtitle title-font">
								<a
									target="_blank"
									rel="noopener noreferrer"
									:href="$t(`${immersive.site}.url`)"
									>{{ $t(immersive.site) }}</a
								>
							</h3>
							<h1 class="title title-font">
								<a
									:href="
										`/teaser/${immersive.linkLabel}/immersive/${immersive.id}`
									"
									>{{ $t(immersive.name) }}</a
								>
							</h1>
						</div>
					</span>
				</b-carousel-item>
			</b-carousel>
		</div>

		<section
			class="home-section"
			style="margin-top: 4rem; margin-bottom: 4rem;"
		>
			<div class="container">
				<div class="header-intro title-font">
					<h2>
						{{ $t('infos_histovery') }}
					</h2>
					<br />
					<h2>
						{{ $t('infos_histovery_2') }}
					</h2>
				</div>
			</div>
		</section>

		<section class="container-fluid header-intro">
			<div class="columns">
				<div class="column is-6 no-margin">
					<div
						class="container"
						style="background-color: #460012; color: white;"
					>
						<h2 style="font-size: 2rem; margin: 0 auto; padding: 2rem;">
							Faire parler <i>les collections</i>
						</h2>
					</div>
					<div class="container">
						<div
							style="
								background-image: url(/img/partners/donjon_de_loches.jpg); width:100%; min-height: 420px;
								background-size:cover;
								background-position: center;
							"
						></div>
					</div>
				</div>
				<div class="column is-6 no-margin">
					<div
						style="
								background-image: url(/img/partners/forteresse_royale_chinon.jpg); width:100%; min-height: 300px;
								background-size:cover;
								background-position: center;
							"
					></div>
					<div class="columns">
						<div
							class="column is-8"
							style="padding-top: 0!important; padding-right:0!important; padding-bottom: 0!important"
						>
							<div
								class="container-fluid"
								style="background-color: #755131; 
										color: white; 
										min-height: 244px;"
							>
								<h2
									style="font-size: 2rem; display: inline-block; vertical-align:middle; padding: 2rem;"
								>
									Partir à <i>la chasse aux trésors.</i>
								</h2>
							</div>
						</div>
						<div
							class="column is-4"
							style="padding-top: 0!important; padding-left:0!important;"
						>
							<div
								style="
								background-image: url(/img/partners/coffre_tresor.jpg); width:100%; 
								min-height: 244px;
								background-size:cover;
								background-position: center;
							"
							></div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<br/><br/>

		<section class="home-section social-network">
			<SocialNetwork />
		</section>

		<footer class="home-footer">
			<div class="content has-text-centered">
				<p>
					HistoPad Teaser - version {{ pkgVersion }} - Copyright société
					<strong><a href="https://www.histovery.com">Histovery</a></strong>
					2020
				</p>
			</div>
		</footer>
	</div>
</template>

<script>
import sites from '../data/sites.json'
import NavigationBar from '../components/NavigationBar'
import SocialNetwork from '../components/SocialNetwork'
import { utilsMixin } from '../utils/mixins'

import pkg from '../../package.json'

export default {
	name: 'AugmentedVisit',
	mixins: [utilsMixin],
	components: {
		NavigationBar,
		SocialNetwork,
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
		}
	},
	computed: {
		pkgVersion() {
			return pkg.version
		},
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
						immersive.site = swi.site
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
	},
}
</script>

<style scoped>
.header-section {
	text-align: center;
}

.carousel .subtitle {
	color: white;
}

.carousel,
.carousel .cover {
	height: 48rem;
}

.no-margin {
	margin: 0 !important;
	padding: 0 !important;
}

@media screen and (max-width: 768px) {
	.main-logo {
		max-width: 60%;
		height: auto;
	}
}
</style>

<template>
	<div class="container-fluid">
		<NavigationBar />
		<section class="header-section">
			<h1 class="title title-font">
				<img
					class="main-logo"
					src="/img/logos/logo_histopad.png"
					alt="HistoPad"
				/>
			</h1>
		</section>

		<div class="container-fluid header-section header-image-section" v-if="availabeImmersives.length > 0">
			<div
				class="cover"
				:style="`background-image: url(${randomImage()}); 
				width:100%;
				background-size:cover;
				background-position: center;
				box-shadow: inset 0px 0px 100vw 48rem rgba(67,57,16,0.33);
				display: table;`"
			>
				<div
					style="display: table-cell; vertical-align: middle; text-align:center;"
				>
					<h1
						class="title title-font"
						style="padding-right: 6rem; padding-left: 6rem;"
					>
						Découvrez près de 15 monuments historiques et musées grâce à la
						visite augmentée HistoPad !
					</h1>
				</div>
				<div style="position: absolute; left: 50%;  bottom: -8rem;">
					<div style="position: relative; left: -50%;">
						<button class="button is-large background-button" slot="trigger">
							<template>
								<b-icon icon="chevron-down"></b-icon>
							</template>
						</button>
					</div>
				</div>
			</div>
		</div>

		<section class="home-section header-intro title-font">
			<div class="container">
				<h1>Nos visites augmentées</h1>
			</div>
		</section>

		<section class="home-section header-intro title-font">
			<div class="columns" v-for="(row, index) in rows" :key="index">
				<div class="column is-4" style="cursor: pointer;" v-for="site in row" :key="site.site">
					<div
						class="site-tile"
						:style="`background-image: url(${coverURL(site)}); 
							width: 100%;
							background-size:cover;
							background-position: center;
							display: table;`"
					>
						<div
							class="content-site-tile"
							@click="onSiteClick(site)"
						>
							<h2>{{ $t(site.site) }}</h2>
							<b-icon
								pack="far"
								icon="play-circle"
								size="is-large"
								type="is-white"
								v-if="site.interact"
							>
							</b-icon>
							<h3 v-if="!site.interact">Prochainement</h3>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="home-section header-intro title-font">
			<div class="container">
				<h1>Voyage immersif</h1>
				<h1>Voyage interactif</h1>
				<h1>Voyage validé par les historiens</h1>
				<h1>L'<strong>HistoPad</strong>, <span><i>Voyage dans le temps</i></span></h1>
			</div>
		</section>

		<section class="home-section social-network">
			<SocialNetwork />
		</section>

		<Footer />
	</div>
</template>

<script>
import sites from '../data/sites.json'
import SocialNetwork from '../components/SocialNetwork'
import NavigationBar from '../components/NavigationBar'
import Footer from '../components/Footer'
import { utilsMixin } from '../utils/mixins'

import pkg from '../../package.json'

export default {
	name: 'Home',
	mixins: [utilsMixin],
	props: {
		msg: String,
	},
	components: {
		NavigationBar,
		SocialNetwork,
		Footer	
	},
	data() {
		return {
			map: null,
			markers: null,
			popups: null,
			isImmersivesSelectionActive: false,
			selectedSite: null,
			activeTab: 0,
			mapLoaded: false,
			immersives: [],
			displayedSites: [],
			rows: [],
			availabeImmersives: []
		}
	},
	computed: {
		pkgVersion() {
			return pkg.version
		},
	},
	mounted() {
		this.initGrid()
	},
	methods: {
		initGrid() {
			let sitesToDisplay = sites.filter((site) => {
				return site.count == 1
			})

			let sitesWithImmersives = sites.filter(site => {
				return site.count == 1 && site.interact && site.immersives.length > 0
			})

			sitesWithImmersives.forEach((site) => {
				this.availabeImmersives = this.availabeImmersives.concat(site.immersives)
			});

			this.rows = this.chunkArray(sitesToDisplay, 3)
		},
		chunkArray(arr, length) {
			let chunks = [],
				i = 0,
				n = arr.length

			while (i < n) {
				chunks.push(arr.slice(i, (i += length)))
			}

			return chunks
		},
		onSiteClick(site) {
			console.log('Click on site', site)
			if (site.interact) {
				if (site.linkLabel == 'chinon' || site.linkLabel == 'loches') {
					this.$router.push('/chinon-loches')
				} else {
					this.$router.push(`/${site.linkLabel}`)
				}
			}
		},
		// eslint-disable-next-line no-unused-vars
		coverURL(site) {
			//return `/img/immersives/${immersive.name}.jpg`
			return `/img/sites/${site.linkLabel}.jpg`
		},
		randomImage() {
			//return '/img/immersives/Cellier.jpg'

			let index = Math.floor(Math.random() * this.availabeImmersives.length - 1)
			return `/img/immersives/${this.availabeImmersives[index].id}.jpg`

		}
	},
}
</script>

<style scoped>
.header-section {
	text-align: center;
}

.header-image-section {
	padding-top: 3rem;
	padding-bottom: 3rem;
}

.cover {
	height: 48rem;
}

a {
	color: white;
}

a:hover {
	color: gainsboro;
}

span i {
	font-family: 'EB Garamond', serif;
}

.footer a,
.modal a {
	color: black;
}

.footer a:hover,
.modal a:hover {
	color: lightslategrey;
}

.main-logo {
	max-width: 25%;
	height: auto;
}

.background-button,
.background-button:hover,
.background-button:focus {
	background: rgba(0, 0, 0, 0);
	color: white;
	border-color: transparent;
}

.site-tile {
	min-height: 25rem;
	color: white;
}

.content-site-tile {
	display: table-cell; 
	vertical-align: middle; 
	text-align:center;
	opacity: 0;
}

.content-site-tile:hover {
	background-color: rgba(0, 0, 0, 0.3);
	opacity: 1;
}

@media screen and (max-width: 768px) {
	.cover {
		height: 24rem;
	}

	.main-logo {
		max-width: 60%;
		height: auto;
	}
}
</style>

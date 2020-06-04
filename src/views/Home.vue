<template>
	<div class="container-fluid">
		<NavigationBar />

		<div class="container-fluid header-image-section">
			<div class="cover" :style="`background-image: url(${randomImage()});`">
				<div class="cover-title">
					<h1 class="title title-font">
						{{ $t('discover_augmented_visits') }}
					</h1>
					<a href="#" v-scroll-to="'#augmentedvisits'"
						><img src="/img/arrow-down.png" class="arrow-down"
					/></a>
				</div>
			</div>
		</div>

		<section class="home-section header-intro title-font" id="augmentedvisits">
			<div class="container">
				<h1>{{ $t('our_augmented_visits') }}</h1>
			</div>
		</section>

		<section class="home-section header-intro title-font">
			<div class="columns" v-for="(row, index) in rows" :key="index">
				<div
					class="column is-4"
					style="cursor: pointer;"
					v-for="site in row"
					:key="site.site"
				>
					<SiteTile :site="site" />
				</div>
			</div>
		</section>

		<section class="home-section header-intro title-font">
			<div class="container">
				<h1>{{ $t('immersive_journey') }}</h1>
				<h1>{{ $t('interactive_journey') }}</h1>
				<h1>{{ $t('validated_by_historians') }}</h1>
				<h1 v-html="$t('histopad_travel')"></h1>
			</div>
		</section>

		<section class="home-section social-network">
			<SocialNetwork />
		</section>

		<Footer />
	</div>
</template>

<script>
import Vue from 'vue'
import VueScrollTo from 'vue-scrollto'

import sites from '../data/sites.json'
import SocialNetwork from '../components/SocialNetwork'
import NavigationBar from '../components/NavigationBar'
import SiteTile from '../components/SiteTile'
import Footer from '../components/Footer'
import { utilsMixin } from '../utils/mixins'

Vue.use(VueScrollTo, {
	container: 'body',
	duration: 500,
	easing: 'ease',
	offset: 0,
	force: true,
	cancelable: true,
	onStart: false,
	onDone: false,
	onCancel: false,
	x: false,
	y: true,
})

export default {
	name: 'Home',
	mixins: [utilsMixin],
	props: {
		msg: String,
	},
	components: {
		NavigationBar,
		SocialNetwork,
		SiteTile,
		Footer,
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
			availabeImmersives: [],
			isHover: false,
		}
	},
	mounted() {
		this.initGrid()
	},
	methods: {
		initGrid() {
			let sitesToDisplay = sites.filter((site) => {
				return site.count >= 1 && site.home
			})

			let sitesWithImmersives = sites.filter((site) => {
				return site.count == 1 && site.interact && site.immersives.length > 0
			})

			sitesWithImmersives.forEach((site) => {
				this.availabeImmersives = this.availabeImmersives.concat(
					site.immersives
				)
			})

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

		randomImage() {
			return '/img/immersives/Cellier.jpg'

			/*let index = Math.floor(Math.random() * this.availabeImmersives.length - 1)
			return `/img/immersives/${this.availabeImmersives[index].id}.jpg`*/
		},
	},
}
</script>

<style scoped>
.header-section {
	text-align: center;
}

.header-image-section {
	text-align: center;
	margin-top: -3.3em;
	padding-bottom: 3rem;
}

.header-image-section h1 {
	color: white;
}

.cover {
	height: 102vh;
	position: relative;
	width: 100%;
	background-size: cover;
	background-position: center;
	box-shadow: inset 0px 0px 100vw 48rem rgba(67, 57, 16, 0.33),
		inset 0px 0px 120px 60px rgba(0, 0, 0, 0.7);
}

.cover h1 {
	font-size: 2.3rem;
}

a {
	color: white;
}

a:hover {
	color: gainsboro;
}

.cover-title {
	position: absolute;
	top: 50%;
	ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	left: 50%;
	min-width: 90%;
}

.arrow-down {
	width: 4.375rem;
	padding-top: 2em;
	opacity: 0.9;
	transition: ease-in 0.2s;
}

.arrow-down:hover {
	width: 5rem;
	opacity: 1;
	transform: translateY(10px);
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
	max-width: 30%;
	height: auto;
}

.background-button,
.background-button:hover,
.background-button:focus {
	background: rgba(0, 0, 0, 0);
	color: white;
	border-color: transparent;
}

@media screen and (max-width: 767px) {
	.cover h1 {
		font-size: 1.3rem;
	}

	.cover {
		box-shadow: inset 0px 0px 100vw 100vh rgba(67, 57, 16, 0.33),
			inset 0px 0px 100px 50px rgba(0, 0, 0, 0.8);
	}

	.arrow-down {
		width: 3.4375rem;
		padding-top: 2em;
	}

	.main-logo {
		max-width: 60%;
		height: auto;
	}
}
</style>

<template>
	<div class="container">
		<section class="section header-section">
			<h1 class="title title-font">
				<img class="logo" src="/img/logos/logo_histopad.png" alt="HistoPad" />
			</h1>
			<h3>
				Bienvenue sur la page de preview des applications HistoPad. Veuillez
				sélectionner un monument ci-dessous :
			</h3>
		</section>
		<b-tabs
			v-model="activeTab"
			position="is-centered"
			class="block"
			@change="onTabChange"
		>
			<b-tab-item label="Experiences" icon="cube">
				<b-carousel
					:indicator-inside="false"
					v-if="immersives.length > 0"
					:has-drag="true"
				>
					<b-carousel-item v-for="(immersive, i) in immersives" :key="i">
						<span class="image">
							<div
								class="hero-body has-text-centered"
								:style="
									`background-image: url(/img/immersives/${immersive.name}.jpg); height: 60vh; width:100%; background-size:cover;`
								"
							>
								<h3 class="subtitle title-font">{{ immersive.site }}</h3>
								<h1 class="title title-font">
									<a
										:href="
											`/preview/${immersive.site}/immersive/${immersive.id}`
										"
										>{{ $t(immersive.name) }}</a
									>
								</h1>
							</div>
						</span>
					</b-carousel-item>
					<template slot="indicators" slot-scope="props">
						<span class="al image">
							<img
								:src="`/img/immersives/${immersives[props.i].name}-thumb.jpg`"
								:title="props.i"
							/>
						</span>
					</template>
				</b-carousel>
			</b-tab-item>

			<b-tab-item label="Carte" icon="map-marked-alt">
				<div class="map">
					<div
						id="mapglContainer"
						style="
		height: 70vh;"
					></div>
				</div>
			</b-tab-item>
		</b-tabs>

		<footer class="footer">
			<div class="content has-text-centered">
				<p>
					Copyright société
					<strong><a href="https://www.histovery.com">Histovery</a></strong>
					2020
				</p>
			</div>
		</footer>

		<b-modal :active.sync="isImmersivesSelectionActive">
			<div class="tile is-ancestor" v-if="selectedSite">
				<div
					class="tite is-parent"
					v-for="immersive in selectedSite.immersives"
					:key="immersive.name"
				>
					<article class="tile is-child box">
						<p class="title">
							<a
								:href="
									`/preview/${selectedSite.site}/immersive/${immersive.id}`
								"
								>{{ $t(immersive.name) }}</a
							>
						</p>
						<p class="subtitle">With an image</p>
						<figure class="image is-4by3">
							<img src="https://bulma.io/images/placeholders/640x480.png" />
						</figure>
					</article>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import sites from '../data/sites.json'
import geoData from '../data/geo.json'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
	'pk.eyJ1IjoidGl3ZW5jZSIsImEiOiJjazlpNms1dXgwMGwxM3FxY2gwZzZqeXB3In0.AxKj_fU8XeDD0ru_uCSCHw'

export default {
	name: 'Home',
	props: {
		msg: String,
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
		}
	},
	mounted() {
		this.initCarousel()
		if (this.activeTab == 1) {
			this.initMap()
		}
	},
	methods: {
		initCarousel() {
			let siteWithImmersives = sites.filter((site) => {
				return site.immersives && site.immersives.length > 0
			})

			this.immersives = []
			siteWithImmersives.forEach((swi) => {
				this.immersives = this.immersives.concat(
					swi.immersives.map((immersive) => {
						immersive.site = swi.site
						return immersive
					})
				)
			})

			console.log('Immersives', this.immersives)
		},
		initMap() {
			setTimeout(() => {
				this.loadMap().then(() => {
					this.mapLoaded = true
					this.addGeoJSONData()
				})
			}, 200)
		},
		loadMap() {
			return new Promise((resolve) => {
				this.map = new mapboxgl.Map({
					container: 'mapglContainer',
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [0.9848193, 47.4135606],
					zoom: 8,
					maxZoom: 22,
					minZoom: 5,
				})

				this.map.on('style.load', () => {
					resolve()
				})
			})
		},
		addGeoJSONData() {
			let that = this

			this.map.on('load', function() {
				that.map.addSource('places', {
					type: 'geojson',
					data: geoData,
				})

				that.map.addLayer({
					id: 'places',
					type: 'symbol',
					source: 'places',
					layout: {
						'icon-image': '{icon}-15',
						'icon-allow-overlap': false,
					},
				})

				let popup = new mapboxgl.Popup({
					closeButton: false,
					closeOnClick: false,
				})

				that.map.on('mouseenter', 'places', (e) => {
					that.map.getCanvas().style.cursor = 'pointer'

					let coordinates = e.features[0].geometry.coordinates.slice()
					let description = e.features[0].properties.description

					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
					}

					popup
						.setLngLat(coordinates)
						.setHTML(description)
						.addTo(that.map)
				})

				that.map.on('mouseleave', 'places', () => {
					that.map.getCanvas().style.cursor = ''
					popup.remove()
				})

				that.map.on('click', 'places', (e) => {
					let siteID = e.features[0].properties.id

					let site = sites.find((s) => {
						return s.site == siteID
					})

					if (site && site.immersives && site.immersives.length > 0) {
						that.selectedSite = site
						that.isImmersivesSelectionActive = true
					}
					/*if (e.features[0].properties.id == 'france.amboise.chateau') {
						that.$router.push(`/preview/${e.features[0].properties.id}`)
					} else {
						that.isImmersivesSelectionActive = true
					}*/
				})
			})
		},
		loadMarkers() {
			this.markers = []
			this.popups = []
			sites.forEach((site) => {
				let popup = new mapboxgl.Popup({ offset: 25 }).setText(site.name)
				this.markers.push(
					new mapboxgl.Marker()
						.setLngLat(site.lngLat)
						.setPopup(popup)
						.addTo(this.map)
				)
				this.popups.push(popup)
			})
		},
		onTabChange() {
			if (!this.mapLoaded) {
				this.initMap()
			}
		},
		getImgUrl(value) {
			return `https://picsum.photos/id/43${value}/1230/500`
		},
	},
}
</script>

<style scoped>
.header-section {
	text-align: center;
}
.map {
	width: 100%;
	height: 100%;
}
.logo {
	max-width: 25%;
	height: auto;
}

.carousel .subtitle {
	color: white;
}

a {
	color: white;
}

a:hover {
	color: gainsboro;
}

.footer a,
.modal a {
	color: black;
}

.footer a:hover,
.modal a:hover {
	color: lightslategrey;
}
</style>

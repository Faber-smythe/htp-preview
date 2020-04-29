<template>
	<div class="container">
		<section class="section">
			<h1 class="title title-font">HistoPad preview</h1>
			<h3>
				Bienvenue sur la page de preview des applications HistoPad. Veuillez
				sélectionner un monument ci-dessous :
			</h3>
		</section>
		<div class="map">
			<div
				id="mapglContainer"
				style="
		height: 70vh;"
			></div>
		</div>
		<footer class="footer">
			<div class="content has-text-centered">
				<p>
					Copyright société <strong><a href="https://www.histovery.com">Histovery</a></strong> 2020
				</p>
			</div>
		</footer>

		<b-modal :active.sync="isImmersivesSelectionActive">
			<div class="tile is-ancestor">
				<div class="tile is-parent">
					<article class="tile is-child box">
						<p class="title">Hello World</p>
						<p class="subtitle">What is up?</p>
					</article>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box">
						<p class="title">Foo</p>
						<p class="subtitle">Bar</p>
					</article>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box">
						<p class="title">Third column</p>
						<p class="subtitle">With some content</p>
						<div class="content">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
								ornare magna eros, eu pellentesque tortor vestibulum ut.
								Maecenas non massa sem. Etiam finibus odio quis feugiat
								facilisis.
							</p>
						</div>
					</article>
				</div>
			</div>

			<div class="tile is-ancestor">
				<div class="tile is-vertical is-8">
					<div class="tile">
						<div class="tile is-parent is-vertical">
							<article class="tile is-child box">
								<p class="title">Vertical tiles</p>
								<p class="subtitle">Top box</p>
							</article>
							<article class="tile is-child box">
								<p class="title">Vertical tiles</p>
								<p class="subtitle">Bottom box</p>
							</article>
						</div>
						<div class="tile is-parent">
							<article class="tile is-child box">
								<p class="title">Middle box</p>
								<p class="subtitle">With an image</p>
								<figure class="image is-4by3">
									<img src="https://bulma.io/images/placeholders/640x480.png" />
								</figure>
							</article>
						</div>
					</div>
					<div class="tile is-parent">
						<article class="tile is-child box">
							<p class="title">Wide column</p>
							<p class="subtitle">Aligned with the right column</p>
							<div class="content">
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
									ornare magna eros, eu pellentesque tortor vestibulum ut.
									Maecenas non massa sem. Etiam finibus odio quis feugiat
									facilisis.
								</p>
							</div>
						</article>
					</div>
				</div>
				<div class="tile is-parent">
					<article class="tile is-child box">
						<div class="content">
							<p class="title">Tall column</p>
							<p class="subtitle">With even more content</p>
							<div class="content">
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
									semper diam at erat pulvinar, at pulvinar felis blandit.
									Vestibulum volutpat tellus diam, consequat gravida libero
									rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend,
									nunc dui porta orci, quis semper odio felis ut quam.
								</p>
								<p>
									Suspendisse varius ligula in molestie lacinia. Maecenas varius
									eget ligula a sagittis. Pellentesque interdum, nisl nec
									interdum maximus, augue diam porttitor lorem, et sollicitudin
									felis neque sit amet erat. Maecenas imperdiet felis nisi,
									fringilla luctus felis hendrerit sit amet. Aenean vitae
									gravida diam, finibus dignissim turpis. Sed eget varius
									ligula, at volutpat tortor.
								</p>
								<p>
									Integer sollicitudin, tortor a mattis commodo, velit urna
									rhoncus erat, vitae congue lectus dolor consequat libero.
									Donec leo ligula, maximus et pellentesque sed, gravida a
									metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet
									lacus, quis faucibus libero. Quisque non semper leo.
								</p>
							</div>
						</div>
					</article>
				</div>
			</div>

			<div class="tile is-ancestor">
				<div class="tile is-parent">
					<article class="tile is-child box">
						<p class="title">Side column</p>
						<p class="subtitle">With some content</p>
						<div class="content">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
								ornare magna eros, eu pellentesque tortor vestibulum ut.
								Maecenas non massa sem. Etiam finibus odio quis feugiat
								facilisis.
							</p>
						</div>
					</article>
				</div>
				<div class="tile is-parent is-8">
					<article class="tile is-child box">
						<p class="title">Main column</p>
						<p class="subtitle">With some content</p>
						<div class="content">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
								ornare magna eros, eu pellentesque tortor vestibulum ut.
								Maecenas non massa sem. Etiam finibus odio quis feugiat
								facilisis.
							</p>
						</div>
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
		}
	},
	mounted() {
		this.loadMap().then(() => {
			this.addGeoJSONData()
		})
	},
	methods: {
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
					console.log('Click on', e.features[0].properties)
					if (e.features[0].properties.id == 'france.amboise.chateau') {
						that.$router.push(`/preview/${e.features[0].properties.id}`)
					} else {
						that.isImmersivesSelectionActive = true
					}
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
	},
}
</script>

<style scoped>
.map {
	width: 100%;
	height: 100%;
	margin-bottom: 3em;
}
</style>

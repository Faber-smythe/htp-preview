<template>
	<div class="parent">
		<div class="scene" ref="scene3D"></div>

		<section>
			<div class="columns is-mobile">
				<div class="column is-half is-offset-one-quarter">
					<b-field>
						<b-slider
							type="is-primary"
							:min="immersiveDescription.eras[0].date"
							:max="immersiveDescription.eras[1].date"
							:value="immersiveDescription.eras[0].date"
							:bigger-slider-focus="true"
							:tooltip="isOverBound"
							v-model="draggingValue"
							@dragging="onSliderDragging"
							@change="onSliderDragging"
						></b-slider>
					</b-field>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import * as THREE from 'three'
import Bluebird from 'bluebird'
import { HotspotUtil } from '../utils/HotspotUtil'

export default {
	name: 'Immersive',
	props: {
		site: String,
	},
	data() {
		return {
			onPointerDownPointerX: 0,
			onPointerDownPointerY: 0,
			lat: 0,
			lon: 0,
			fov: 60,
			onPointerDownLon: 0,
			onPointerDownLat: 0,
			phi: 0,
			theta: 0,
			width: window.innerWidth,
			height: window.innerHeight,
			ratio: window.innerWidth / window.innerHeight,
			renderer: null,
			camera: null,
			scene: null,
			rayCaster: null,
			mesh: null,
			hotspotTexture: null,
			geometry: null,
			material: null,
			el: null,
			textureLoader: new THREE.TextureLoader(),
			isUserInteracting: false,
			isMenuVisible: false,
			scaling: false,
			manager: null,
			draggingValue: 0,
			loadedTextures: [],
			immersiveDescription: {
				eras: [
					{
						date: 1500,
						file: 'grande-salle-audience_equi.jpg',
					},
					{
						date: 1700,
						file: 'grande-salle-banquet_equi.jpg',
					},
				],
			},
			meshes: [],
			immersiveScene: null,
			hotspotUtil: new HotspotUtil(),
		}
	},
	mounted() {
		this.immersiveScene = require('../data/sites/france.amboise.chateau/ConfigurationFiles_immgrandesalle.json')
		console.log('this.immersiveScene', this.immersiveScene)
		setTimeout(() => {
			this.init()
		})
	},
	beforeDestroy() {
		if (this.scene) {
			this.scene.children.forEach((child) => {
				child.remove()
			})
			if (this.geometry) this.geometry.dispose()
			if (this.material) this.material.dispose()
			if (this.texture) this.texture.dispose()
		}
	},
	computed: {
		isOverBound() {
			return this.draggingValue == 1500 || this.draggingValue == 1700
		},
	},
	methods: {
		init() {
			this.el = this.$refs['scene3D']

			this.initScene()
			this.loadAssets()
			this.animate()
			window.addEventListener('resize', this.onWindowResize, false)
		},
		initScene() {
			this.scene = new THREE.Scene()
			this.rayCaster = new THREE.Raycaster()

			this.camera = new THREE.PerspectiveCamera(
				this.fov,
				this.el.clientWidth / this.el.clientHeight,
				1,
				1000
			)

			this.renderer = new THREE.WebGLRenderer()
			console.log('window.devicePixelRatio', window.devicePixelRatio)
			this.renderer.setPixelRatio(2)
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			//Add event listeners

			//Add events listener
			this.el.addEventListener('mousedown', this.onDocumentMouseDown, false)
			this.el.addEventListener('touchstart', this.onDocumentMouseDown, false)
			this.el.addEventListener('wheel', this.onDocumentMouseWheel, false)
		},
		animate() {
			requestAnimationFrame(this.animate)

			this.lat = Math.max(-90, Math.min(90, this.lat))
			this.phi = THREE.MathUtils.degToRad(90 - this.lat)
			this.theta = THREE.MathUtils.degToRad(this.lon)

			this.camera.position.x = 100 * Math.sin(this.phi) * Math.cos(this.theta)
			this.camera.position.y = 100 * Math.cos(this.phi)
			this.camera.position.z = 100 * Math.sin(this.phi) * Math.sin(this.theta)

			this.camera.lookAt(this.scene.position)

			this.renderer.render(this.scene, this.camera)
		},
		loadAssets() {
			this.geometry = new THREE.SphereGeometry(800, 60, 40)
			this.geometry.scale(-1, 1, 1)

			this.hotspotTexture = this.textureLoader.load(`/assets/textures/info.png`)

			Bluebird.each(this.immersiveDescription.eras, (era) => {
				return new Promise((resolve, reject) => {
					this.textureLoader.load(
						`/assets/immersives/${this.site}/${era.file}`,
						(texture) => {
							let material = new THREE.MeshBasicMaterial({
								map: texture,
								transparent: true,
							})
							let mesh = new THREE.Mesh(this.geometry, material)
							era['uuid'] = mesh.uuid
							this.meshes.push(mesh)
							this.scene.add(mesh)
							resolve(true)
						},
						() => {},
						(error) => {
							reject(error)
						}
					)
				})
			})
				.then(() => {
					this.meshes[0].material.opacity = 1
					this.meshes[1].material.opacity = 0
					this.displayHotspots()
				})
				.catch((error) => {
					console.error('Error when loading texture:', error)
				})
		},
		onWindowResize() {
			this.camera.aspect = this.el.clientWidth / this.el.clientHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
		},
		onDocumentMouseWheel(event) {
			this.fov = this.camera.fov + event.deltaY * 0.05
			this.camera.fov = THREE.MathUtils.clamp(this.fov, 20, 60)
			this.camera.updateProjectionMatrix()
		},
		onDocumentMouseDown(event) {
			event.preventDefault()

			if (!this.isMenuVisible) {
				this.onPointerDownPointerX = event.clientX
					? event.clientX
					: event.touches[0].clientX
				this.onPointerDownPointerY = event.clientY
					? event.clientY
					: event.touches[0].clientY
				this.onPointerDownLon = this.lon
				this.onPointerDownLat = this.lat

				this.isUserInteracting = true

				this.el.addEventListener('mousemove', this.onDocumentMouseMove, false)
				this.el.addEventListener('mouseup', this.onDocumentMouseUp, false)

				if (event.touches && event.touches.length == 1) {
					this.el.addEventListener('touchmove', this.onDocumentMouseMove, false)
					this.el.addEventListener('touchend', this.onDocumentMouseUp, false)
				} else if (event.touches && event.touches.length == 2) {
					this.scaling = true
					this.pinchStart(event)
				}
			} else {
				this.isUserInteracting = false
				this.el.removeEventListener(
					'mousemove',
					this.onDocumentMouseMove,
					false
				)
				this.el.removeEventListener(
					'touchmove',
					this.onDocumentMouseMove,
					false
				)
				this.el.removeEventListener('mouseup', this.onDocumentMouseUp, false)
				this.el.removeEventListener('touchend', this.onDocumentMouseUp, false)
			}
		},
		onDocumentMouseUp(event) {
			this.isUserInteracting = false
			this.el.removeEventListener('mousemove', this.onDocumentMouseMove, false)
			this.el.removeEventListener('mouseup', this.onDocumentMouseUp, false)
			this.el.removeEventListener('touchstart', this.onDocumentMouseMove, false)
			this.el.removeEventListener('touchend', this.onDocumentMouseUp, false)
			if (this.scaling) {
				this.pinchEnd(event)
				this.scaling = false
			}
		},
		onDocumentMouseMove(event) {
			if (!this.isMenuVisible) {
				if (!this.scaling) {
					let eventX = event.clientX ? event.clientX : event.touches[0].clientX
					let eventY = event.clientY ? event.clientY : event.touches[0].clientY
					this.lon =
						(eventX - this.onPointerDownPointerX) * -0.175 +
						this.onPointerDownLon

					this.lat =
						(eventY - this.onPointerDownPointerY) * -0.175 +
						this.onPointerDownLat
				} else {
					this.pinchMove(event)
				}
			}
		},
		pinchStart(event) {
			console.log('pinchstart', event)
		},
		pinchMove(event) {
			let dist = Math.hypot(
				event.touches[0].pageX - event.touches[1].pageX,
				event.touches[0].pageY - event.touches[1].pageY
			)
			console.log('pinchmove', dist)
		},
		pinchEnd(event) {
			console.log('pinchEnd', event)
		},
		onSliderDragging() {
			let opacity = (this.draggingValue - 1500) / (1700 - 1500)
			//this.material.opacity = opacity
			this.meshes[0].material.opacity = 1 - opacity
			this.meshes[1].material.opacity = 0 + opacity
		},
		displayHotspots() {
			this.immersiveScene.hotspots.forEach((hotspot) => {
				let point = this.hotspotUtil.generate3DPosition(hotspot, 790)
				let spriteMaterial = new THREE.SpriteMaterial({
					map: this.hotspotTexture,
					opacity: 1,
					transparent: true
				})
				let sprite = new THREE.Sprite(spriteMaterial)
				sprite.scale.set(30, 30, 1)
				sprite.position.copy(point.clone())
				this.scene.add(sprite)
			})
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scene {
	width: 100%;
	height: 100%;
	margin-bottom: 3em;
}
.parent {
	width: 100%;
	height: 80vh;
}
.min-height {
	height: 100%;
}
</style>

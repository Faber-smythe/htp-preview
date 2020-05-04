<template>
	<div class="parent">
		<div class="scene" ref="scene3D"></div>

		<div v-if="immersiveScene" class="header-immersive has-text-centered">
			<h2 class="title-font header-title">
				<router-link to="/"
					><b-icon
						pack="fas"
						icon="long-arrow-alt-left"
						type="is-white"
						style="margin-right: 0.8em; margin-top: 0.1em;"
					></b-icon
				></router-link>
				<span>&nbsp;&nbsp;&nbsp;{{ immersiveTitle }}</span>
			</h2>
		</div>

		<!-- Custom tooltip -->
		<div class="custom-tooltip" ref="tooltip" id="tooltip">
			<span class="tooltiptext">{{ focusedContent }}</span>
		</div>

		<div class="player-footer">
			<div class="columns is-mobile is-vcentered">
				<div
					class="column is-size-4 is-offset-4"
					v-if="
						immersiveScene &&
							immersiveScene.layers &&
							immersiveScene.layers.length > 0
					"
				>
					<b-field>
						<b-slider
							type="is-white"
							tooltip-type="is-white"
							:min="0"
							:max="100"
							:value="0"
							:bigger-slider-focus="true"
							:tooltip="isOverBound"
							v-model="draggingValue"
							:custom-formatter="onTooltipFormat"
							@dragging="onSliderDragging"
							@input="onSliderDragging"
						></b-slider>
					</b-field>
				</div>
				<div class="column is-one-quarter">
					<div class="field">
						<b-switch :value="false" v-model="isMute" @input="toggleMute">
							Mute
						</b-switch>
					</div>
				</div>
			</div>
		</div>
		<b-modal :active.sync="isModalCloseUpVisible">
			<p class="image" v-if="closeUpImage">
				<span>{{ focusedContent }}</span>
				<img :src="closeUpImage" />
			</p>
		</b-modal>
	</div>
</template>

<script>
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Bluebird from 'bluebird'
import { HotspotManager } from '../utils/HotspotManager'
import { SoundManager } from '../utils/SoundManager'
import { ImmersiveManager } from '../utils/ImmersiveManager'
// eslint-disable-next-line no-unused-vars
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls'

export default {
	name: 'Immersive',
	props: {
		site: String,
		immersiveFileName: String,
	},
	data() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			ratio: window.innerWidth / window.innerHeight,
			onMouseDownMouseX: 0,
			onMouseDownMouseY: 0,
			lon: 0,
			lat: 0,
			onMouseDownLon: 0,
			onMouseDownLat: 0,
			phi: 0,
			theta: 0,
			renderer: null,
			camera: null,
			controls: null,
			scene: null,
			hotspotScene: null,
			rayCaster: null,
			mesh: null,
			hotspotTexture: null,
			geometry: null,
			material: null,
			el: null,
			textureLoader: new THREE.TextureLoader(),
			isUserInteracting: false,
			isTweening: false,
			isMenuVisible: false,
			scaling: false,
			manager: null,
			draggingValue: 0,
			loadedTextures: [],
			hotspots: [],
			meshes: [],
			selectedMesh: null,
			previousMeshId: '',
			immersiveScene: null,
			hotspotManager: new HotspotManager(),
			immersiveManager: new ImmersiveManager(),
			soundManager: null,
			isMute: false,
			focusedHotspot: {},
			tooltip: null,
			closeUpImage: '',
			isModalCloseUpVisible: false,
			loadingComponent: null,
		}
	},
	mounted() {
		this.immersiveScene = JSON.parse(
			JSON.stringify(
				require(`../data/sites/${this.site}/${this.immersiveFileName}`)
			)
		)
		if (!this.immersiveScene.layers) {
			this.immersiveManager.processOldImmersive(this.immersiveScene)
		}
		//Loading only text hotspot and close ups
		this.immersiveScene.hotspots = this.immersiveScene.hotspots.filter(
			(hotspot) => {
				return (
					hotspot.type === 'TextHotspot' || hotspot.type === 'CloseUpHotspot'
				)
			}
		)
		setTimeout(() => {
			this.init()
		})
	},
	beforeDestroy() {
		console.log('beforeDestroy')
		if (this.scene) {
			this.scene.children.forEach((child) => {
				child.remove()
			})
			if (this.geometry) this.geometry.dispose()
			if (this.material) this.material.dispose()
			if (this.texture) this.texture.dispose()
		}
		this.soundManager.unloadSounds()
	},
	computed: {
		isOverBound() {
			return this.draggingValue == 0 || this.draggingValue == 100
		},
		focusedContent() {
			if (
				this.focusedHotspot &&
				this.focusedHotspot.contentList &&
				this.focusedHotspot.contentList.length > 0
			) {
				let key = this.focusedHotspot.contentList[0].value
					.replace('${', '')
					.replace('}', '')

				return this.$t(key)
			} else {
				return ''
			}
		},
		immersiveTitle() {
			let index = this.draggingValue > 50 ? 1 : 0
			return this.$t(
				this.immersiveScene.layers[index].cartelDescription.title
					.replace('${', '')
					.replace('}', '')
			)
		},
	},
	methods: {
		init() {
			this.el = this.$refs['scene3D']
			this.tooltip = this.$refs['tooltip']

			this.textureLoader.setCrossOrigin('anonymous')
			this.soundManager = new SoundManager()

			this.initScene()
			this.loadAssets()
			this.initAmbient()
			this.animate()
			window.addEventListener('resize', this.onWindowResize, false)
		},
		initScene() {
			this.scene = new THREE.Scene()
			this.hotspotScene = new THREE.Scene()
			this.rayCaster = new THREE.Raycaster()

			this.camera = new THREE.PerspectiveCamera(
				this.fov,
				this.el.clientWidth / this.el.clientHeight,
				1,
				4000
			)
			this.camera.position.set(0, 0, 0)
			this.camera.target = new THREE.Vector3(0, 0, 0)

			this.renderer = new THREE.WebGLRenderer()
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.sortObjects = false
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			new TWEEN.Tween( this.camera.target).to({position: this.camera.target}, 2000)
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			/*this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			this.controls.enableDamping = true
			this.controls.enableZoom = true
			this.controls.rotateSpeed = -0.5*/

			console.log('world projection', this.camera.getWorldDirection())

			var axesHelper = new THREE.AxesHelper(5)
			this.scene.add(axesHelper)

			//Add events listeners
			this.el.addEventListener('mousedown', this.onPointerStart, false)
			this.el.addEventListener('mousemove', this.onPointerMove, false)
			this.el.addEventListener('mouseup', this.onPointerUp, false)

			this.el.addEventListener('touchstart', this.onPointerStart, false)
			this.el.addEventListener('touchmove', this.onPointerMove, false)
			this.el.addEventListener('touchend', this.onPointerUp, false)

			//this.el.addEventListener('mousedown', this.onDocumentMouseDown, false)
			this.el.addEventListener('mousemove', this.onMouseOver, false)
			this.el.addEventListener('click', this.onClick, false)
			this.el.addEventListener('touchstart', this.onMouseOver, false)

			//this.el.addEventListener('touchstart', this.onDocumentMouseDown, false)

			this.el.addEventListener('wheel', this.onDocumentMouseWheel, false)

			//this.el.addEventListener('touchstart', this.onMouseOver, false)
		},
		initAmbient() {
			let soundFiles = this.immersiveScene.layers.filter((layer) => {
				return (
					layer.ambianceSound &&
					layer.ambianceSound.fileName &&
					layer.ambianceSound.fileName != ''
				)
			})
			soundFiles = soundFiles.map((soundFile) => {
				return {
					url: `/assets/immersives/${this.site}/sounds/${soundFile.ambianceSound.fileName}.mp3`,
					volume: soundFile.ambianceSound.volume,
				}
			})

			this.soundManager
				.init(soundFiles)
				.then(() => {
					this.soundManager.playSoundAtIndex(0)
				})
				.catch((error) => {
					console.error('Error when playing sound:', error)
				})
		},
		animate() {
			requestAnimationFrame(this.animate)

			/*if (!this.isUserInteracting) {
				this.lon += 0.1
			}*/

			this.lat = Math.max(-85, Math.min(85, this.lat))
			this.phi = THREE.MathUtils.degToRad(90 - this.lat)
			this.theta = THREE.MathUtils.degToRad(this.lon)

			this.camera.target.x = 2048 * Math.sin(this.phi) * Math.cos(this.theta)
			this.camera.target.y = 2048 * Math.cos(this.phi)
			this.camera.target.z = 2048 * Math.sin(this.phi) * Math.sin(this.theta)

			this.camera.lookAt(this.camera.target)
			
			//this.controls.update()
			TWEEN.update();
			this.renderer.render(this.scene, this.camera)
		},
		createHotpotScene() {
			let material = new THREE.MeshBasicMaterial({
				transparent: true,
				depthWrite: false,
				opacity: 0,
				color: 0xffff00,
			})
			let mesh = new THREE.Mesh(this.geometry, material)
			this.meshes.push(mesh)
			this.hotspotScene.add(mesh)
		},
		loadAssets() {
			this.displayLoading(true)
			this.geometry = new THREE.SphereGeometry(2048, 60, 40)
			this.geometry.scale(-1, 1, 1)
			this.hotspotManager.loadHotspotTextures()

			Bluebird.each(this.immersiveScene.layers, (layer, index) => {
				return new Promise((resolve, reject) => {
					console.log('Load layer', layer)
					this.textureLoader.load(
						`/assets/immersives/${this.site}/${layer.uniqueID}.png`,
						(texture) => {
							let material = new THREE.MeshBasicMaterial({
								map: texture,
								transparent: true,
								depthWrite: false,
								side: THREE.DoubleSide,
							})
							let mesh = new THREE.Mesh(this.geometry, material)
							mesh.uuid = layer.uniqueID
							mesh.renderOrder = index
							//layer['uuid'] = mesh.uuid
							this.meshes.push(mesh)
							this.scene.add(mesh)
							mesh.position.set(0, 0, 0)
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
					this.selectedMesh = this.meshes[0]
					this.previousMeshId = this.selectedMesh.uuid
					//this.createHotpotScene()
					this.displayHotspots()
					this.updateHotspotsOpacity()
					this.displayLoading(false)
				})
				.catch((error) => {
					console.error('Error when loading texture:', error)
					this.displayLoading(false)
				})
		},
		displayLoading(isLoading) {
			if (isLoading) {
				this.loadingComponent = this.$buefy.loading.open({
					container: this.el,
				})
			} else {
				this.loadingComponent.close()
			}
		},
		onWindowResize() {
			this.camera.aspect = this.el.clientWidth / this.el.clientHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
		},
		onPointerStart(event) {
			this.isUserInteracting = true

			let clientX = event.clientX || event.touches[0].clientX
			let clientY = event.clientY || event.touches[0].clientY

			this.onMouseDownMouseX = clientX
			this.onMouseDownMouseY = clientY

			this.onMouseDownLon = this.lon
			this.onMouseDownLat = this.lat
		},
		onPointerMove(event) {
			if (this.isUserInteracting) {
				let clientX = event.clientX || event.touches[0].clientX
				let clientY = event.clientY || event.touches[0].clientY

				this.lon =
					(this.onMouseDownMouseX - clientX) * 0.3 + this.onMouseDownLon
				this.lat =
					(clientY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat
				
				this.toggleTooltip('hide')
			}
		},
		onPointerUp() {
			this.isUserInteracting = false
		},
		onDocumentMouseWheel(event) {
			console.log('onDocumentMouseWheel', event)
			this.setCameraZoom(event.deltaY)
		},
		pinchStart(event) {
			console.log('pinchstart', event)
			let dx = event.touches[0].pageX - event.touches[1].pageX
			let dy = event.touches[0].pageY - event.touches[1].pageY
			this.touchDistanceEnd = this.touchDistanceStart = Math.sqrt(
				dx * dx + dy * dy
			)
			console.log('Pinch started', this.touchDistanceEnd)
		},
		pinchMove(event) {
			let dx = event.touches[0].pageX - event.touches[1].pageX
			let dy = event.touches[0].pageY - event.touches[1].pageY
			this.touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy)
			console.log('pinchmove', this.touchZoomDistanceEnd)
			let factor = this.touchDistanceStart / this.touchDistanceEnd
			this.touchZoomDistanceStart = this.touchZoomDistanceEnd
			this.setCameraZoom(factor)
		},
		pinchEnd(event) {
			console.log('pinchEnd', event)
			this.touchDistanceEnd = this.touchDistanceStart = 0
			this.scaling = false
		},
		setCameraZoom(zoom) {
			this.fov = this.camera.fov + zoom * 0.05
			console.log('this.fov', this.fov, THREE.MathUtils.clamp(this.fov, 20, 60))
			this.camera.fov = THREE.MathUtils.clamp(this.fov, 20, 60)
			this.camera.updateProjectionMatrix()
		},
		onMouseOver(event) {
			event.preventDefault()

			let domRect = this.el.getBoundingClientRect()

			let clientX = event.clientX || event.touches[0].clientX
			let clientY = event.clientY || event.touches[0].clientY

			let mouse = new THREE.Vector2(
				((clientX - domRect.x) / this.el.clientWidth) * 2 - 1,
				-((clientY - domRect.y) / this.el.clientHeight) * 2 + 1
			)

			this.rayCaster.setFromCamera(mouse, this.camera)

			this.toggleTooltip('hide')
			this.tooltip.style.opacity = 0

			//On focus behaviour
			let intersects = this.rayCaster.intersectObjects(this.scene.children)
			intersects.forEach((intersect) => {
				let intersected = intersect.object
				if (
					intersected.type === 'Sprite' &&
					intersected.material.opacity === 1
				) {
					this.focusedHotspot = this.immersiveScene.hotspots.find((hotspot) => {
						return hotspot.uniqueID == intersected.uuid
					})

					if (this.focusedHotspot.type == 'TextHotspot') {
						setTimeout(() => {
							this.toggleTooltip('show')
							let tooltipRect = this.tooltip.getBoundingClientRect()
							this.tooltip.style.top = `${clientY -
								tooltipRect.height -
								20}px`
							this.tooltip.style.left = `${clientX - domRect.x - 150}px`
							this.tooltip.style.opacity = 1

							console.log('position', this.tooltip.style.left, this.tooltip.style.top )
						}, 100)
					}
				}
			})

			return false
		},
		onClick(event) {
			event.preventDefault()

			let domRect = this.el.getBoundingClientRect()

			let clientX = event.clientX || event.touches[0].clientX
			let clientY = event.clientY || event.touches[0].clientY

			let mouse = new THREE.Vector2(
				((clientX - domRect.x) / this.el.clientWidth) * 2 - 1,
				-((clientY - domRect.y) / this.el.clientHeight) * 2 + 1
			)

			this.rayCaster.setFromCamera(mouse, this.camera)

			this.toggleTooltip('hide')
			this.tooltip.style.opacity = 0

			let intersects = this.rayCaster.intersectObjects(this.scene.children)
			intersects.forEach((intersect) => {
				let intersected = intersect.object
				if (
					intersected.type === 'Sprite' &&
					intersected.material.opacity === 1
				) {
					this.focusedHotspot = this.immersiveScene.hotspots.find((hotspot) => {
						return hotspot.uniqueID == intersected.uuid
					})
					if (this.focusedHotspot.type == 'CloseUpHotspot') {
						if (
							(this.focusedHotspot.contentList.length == 1 &&
								event.type == 'click') ||
							event.type == 'touchstart'
						) {
							this.closeUpImage = `/assets/immersives/${this.site}/closeups/${this.focusedHotspot.contentList[0].value}.jpg`
							this.isModalCloseUpVisible = true
						}
					} else if (
						this.focusedHotspot.type == 'TextHotspot' &&
						event.touches &&
						event.touches.length == 1
					) {
						setTimeout(() => {
							this.toggleTooltip('show')
							let tooltipRect = this.tooltip.getBoundingClientRect()
							this.tooltip.style.top = `${clientX - tooltipRect.height - 20}px`
							this.tooltip.style.left = `${clientY - domRect.x - 150}px`
							this.tooltip.style.opacity = 1
							console.log('Position', this.tooltip.style.top, this.tooltip.style.left)
						}, 5)
					}
				}
			})
		},
		onSliderDragging() {
			let opacity = this.draggingValue / 100
			//this.material.opacity = opacity
			this.meshes[0].material.opacity = 1 - opacity
			this.meshes[1].material.opacity = 0 + opacity

			this.selectedMesh = opacity > 0.5 ? this.meshes[1] : this.meshes[0]

			if (this.previousMeshId !== this.selectedMesh.uuid) {
				this.updateHotspotsOpacity()
				this.previousMeshId = this.selectedMesh.uuid
				this.soundManager.playSoundAtIndex(opacity > 0.5 ? 1 : 0)
			}
		},
		onTooltipFormat(value) {
			let index = value > 50 ? 1 : 0
			return this.$t(
				this.immersiveScene.layers[index].localizedTimestampTitle
					.replace('${', '')
					.replace('}', '')
			)
		},
		displayHotspots() {
			this.immersiveScene.hotspots.forEach((hotspot, index) => {
				let point = this.hotspotManager.generate3DPosition(hotspot, 2048)
				let spriteMaterial = new THREE.SpriteMaterial({
					map: this.hotspotManager.textures[hotspot.type],
					transparent: true,
					opacity: 1,
				})
				let sprite = new THREE.Sprite(spriteMaterial)
				sprite.scale.set(200, 200, 1)
				sprite.position.copy(point.clone())
				sprite.uuid = hotspot.uniqueID
				sprite.renderOrder = this.meshes.length + index
				this.hotspots.push(sprite)
				this.scene.add(sprite)
			})
		},
		updateHotspotsOpacity() {
			this.hotspots.forEach((hotspot) => {
				let sprite = this.scene.children.find((child) => {
					return child.uuid == hotspot.uuid
				})
				if (sprite) {
					let sceneHotspot = this.immersiveScene.hotspots.find(
						(immersiveHotspot) => {
							return immersiveHotspot.uniqueID == sprite.uuid
						}
					)
					sprite.material.opacity = this.isHotspotDisplayedInLayer(sceneHotspot)
						? 1
						: 0
				}
			})
		},
		isHotspotDisplayedInLayer(hotspot) {
			if (hotspot.layers && hotspot.layers.length > 0) {
				let foundLayer = hotspot.layers.find((layer) => {
					return layer == this.selectedMesh.uuid
				})
				if (foundLayer) {
					return true
				} else {
					return false
				}
			} else {
				return true
			}
		},
		toggleMute() {
			this.soundManager.mute(this.isMute)
		},
		toggleTooltip(command) {
			this.tooltip.style.display = command === 'show' ? 'block' : 'none'
			this.showTooltip = command === 'show'
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scene {
	width: 100% !important;
	height: 100% !important;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}

.parent {
	width: 100%;
	height: 100%;
}

.player-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 1em;
	background-color: black;
	opacity: 0.8;
	color: white;
}
.custom-tooltip {
	position: absolute;
	width: 300px;
	padding: 5px;
	z-index: 5;
	left: 50px;
	border-radius: 3px;
	font-size: 12px;
	background-color: black;
	color: white;
	display: none;
}

.header-immersive {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: black;
	opacity: 0.8;
	padding: 1em;
	color: white;
	text-align: center;
	font-size: 1.25rem;
	font-weight: 400;
	line-height: 1.25;
}

.header-title {
	display: flex;
	align-items: center;
	justify-content: center;
}

.custom-tooltip .tooltiptext::after {
	content: ' ';
	position: absolute;
	top: 100%; /* At the bottom of the tooltip */
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: black transparent transparent transparent;
}

.b-slider.is-custom .b-slider-fill {
	background: lightslategrey !important;
}
</style>

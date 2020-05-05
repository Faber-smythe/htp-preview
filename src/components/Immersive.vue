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
				<span style="font-size:0.8em; position:absolute; top:3em; left:33%;">{{
					sliderTooltipsLabel[0]
				}}</span>
				<span style="font-size:0.8em; position:absolute; top:3em; right:33%">{{
					sliderTooltipsLabel[1]
				}}</span>

				<div
					class="column is-one-third is-offset-one-third"
					v-if="
						immersiveScene &&
							immersiveScene.layers &&
							immersiveScene.layers.length > 0
					"
				>
					<b-field style="margin-left: 0.5em; margin-right: 0.5em;">
						<b-slider
							type="is-white"
							tooltip-type="is-white"
							:min="0"
							:max="100"
							:value="0"
							:bigger-slider-focus="true"
							:tooltip="false"
							v-model="draggingValue"
							:custom-formatter="onTooltipFormat"
							@dragging="onSliderDragging"
							@input="onSliderDragging"
							orient="vertical"
						></b-slider>
					</b-field>
				</div>
				<div class="column is-2">
					<div class="field">
						<b-switch :value="false" v-model="isMute" @input="toggleMute">
							Mute
						</b-switch>
					</div>
				</div>

				<v-popover offset="16">
					<!-- This will be the popover target (for the events and position) -->
					<button class="tooltip-target b3">Click me</button>

					<!-- This will be the content of the popover -->
					<template slot="popover">
						<div class="range-container">
							<input class="range" type="range" />
						</div>
					</template>
				</v-popover>
			</div>
		</div>
		<b-modal :active.sync="isModalCloseUpVisible">
			<p class="image" v-if="closeUpImage">
				<span>{{ focusedContent }}</span>
				<img :src="closeUpImage" :alt="focusedContent" />
			</p>
		</b-modal>
		<img id="closeUpImg" style="display:none;" />
	</div>
</template>

<script>
import Vue from 'vue'
import * as THREE from 'three'
import Bluebird from 'bluebird'
import { HotspotManager } from '../utils/HotspotManager'
import { SoundManager } from '../utils/SoundManager'
import { ImmersiveManager } from '../utils/ImmersiveManager'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls'

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

const SPHERE_RADIUS = 2048

export default {
	name: 'Immersive',
	props: {
		site: String,
		immersiveFileName: String,
	},
	data() {
		return {
			isEnabled: false,
			width: window.innerWidth,
			height: window.innerHeight,
			ratio: window.innerWidth / window.innerHeight,
			onMouseDownMouseX: 0,
			onMouseDownMouseY: 0,
			lon: -90,
			lat: 0,
			onMouseDownLon: 0,
			onMouseDownLat: 0,
			phi: 0,
			theta: 0,
			renderer: null,
			camera: null,
			fov: 60,
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
			imageCloseUps: {},
			sliderTooltipsLabel: ['', ''],
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
					hotspot.type === 'TextHotspot' ||
					(hotspot.type === 'CloseUpHotspot' && hotspot.contentList.length == 1)
				)
			}
		)

		//Load slider tooltips label
		this.sliderTooltipsLabel = this.immersiveScene.layers.map((layer) => {
			return this.$t(
				layer.localizedTimestampTitle.replace('${', '').replace('}', '')
			)
		})

		this.init()
	},
	beforeDestroy() {
		if (this.scene) {
			this.scene.children.forEach((child) => {
				if (child.geometry && child.material) {
					child.geometry.dispose()
					child.material.dispose()
				}
			})

			this.scene.children.forEach((child) => {
				child.remove()
			})

			this.scene.dispose()
			this.renderer.renderLists.dispose()

			if (this.controls) this.controls.dispose()
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
			this.loadCloseUps()
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
			this.camera.position.set(0, 0, 10)

			this.renderer = new THREE.WebGLRenderer()
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.sortObjects = false
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			this.controls.enableDamping = true
			this.controls.enableZoom = false
			this.controls.rotateSpeed = -0.5

			//var axesHelper = new THREE.AxesHelper(5)
			//this.scene.add(axesHelper)

			//Add events listeners
			//this.el.addEventListener('mousedown', this.onPointerStart, false)
			//this.el.addEventListener('mousemove', this.onPointerMove, false)
			//this.el.addEventListener('mouseup', this.onPointerUp, false)

			//this.el.addEventListener('touchstart', this.onPointerStart, false)
			//this.el.addEventListener('touchmove', this.onPointerMove, false)
			//this.el.addEventListener('touchend', this.onPointerUp, false)

			//this.el.addEventListener('mousedown', this.onDocumentMouseDown, false)
			this.el.addEventListener('mousemove', this.onMouseOver, false)
			this.el.addEventListener('click', this.onClick, false)
			this.el.addEventListener('touchstart', this.onClick, false)

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
		loadCloseUps() {
			let closeUps = this.immersiveScene.hotspots.filter((hotspot) => {
				return (
					hotspot.type === 'CloseUpHotspot' && hotspot.contentList.length === 1
				)
			})

			let image = document.getElementById('closeUpImg')

			closeUps.forEach((closeUp) => {
				let url = `/assets/immersives/${this.site}/closeups/${closeUp.contentList[0].value}.jpg`
				let closeUpImage = new Image()
				closeUpImage.onload = () => {
					image.src = this.src
				}
				closeUpImage.src = url
			})
		},
		animate() {
			requestAnimationFrame(this.animate)

			/*if (!this.isUserInteracting) {
				this.lon += 0.1
			}*/

			/*this.lat = Math.max(-85, Math.min(85, this.lat))
			this.phi = THREE.MathUtils.degToRad(90 - this.lat)
			this.theta = THREE.MathUtils.degToRad(this.lon)

			let target = new THREE.Vector3(
				2048 * Math.sin(this.phi) * Math.cos(this.theta),
				2048 * Math.cos(this.phi),
				2048 * Math.sin(this.phi) * Math.sin(this.theta)
			)

			this.camera.target = target
			this.camera.lookAt(this.camera.target)
			this.camera.updateProjectionMatrix()*/

			this.controls.update()
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
			this.geometry = new THREE.SphereGeometry(SPHERE_RADIUS + 20, 60, 40)
			this.geometry.scale(-1, 1, 1)
			this.hotspotManager.loadHotspotTextures()

			Bluebird.each(this.immersiveScene.layers, (layer, index) => {
				return new Promise((resolve, reject) => {
					this.textureLoader.load(
						`/assets/immersives/${this.site}/${layer.uniqueID}.png`,
						(texture) => {
							let material = new THREE.MeshBasicMaterial({
								map: texture,
								transparent: true,
								side: THREE.DoubleSide,
								depthWrite: true,
							})
							let mesh = new THREE.Mesh(this.geometry, material)
							mesh.uuid = layer.uniqueID
							mesh.renderOrder = index
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
			event.preventDefault()
			this.isUserInteracting = true

			let clientX = event.clientX || event.touches[0].clientX
			let clientY = event.clientY || event.touches[0].clientY

			this.onMouseDownMouseX = clientX
			this.onMouseDownMouseY = clientY

			this.onMouseDownLon = this.lon
			this.onMouseDownLat = this.lat
		},
		onPointerMove(event) {
			event.preventDefault()
			if (this.isUserInteracting) {
				let clientX = event.clientX || event.touches[0].clientX
				let clientY = event.clientY || event.touches[0].clientY

				this.lon =
					(this.onMouseDownMouseX - clientX) * 0.2 + this.onMouseDownLon
				this.lat =
					(clientY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat
			}
		},
		onPointerUp() {
			this.isUserInteracting = false
		},
		onDocumentMouseWheel(event) {
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
			this.toggleTooltip('hide')
			this.fov = this.camera.fov + zoom * 0.05
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
							this.tooltip.style.top = `${clientY - tooltipRect.height - 20}px`
							this.tooltip.style.left = `${clientX - domRect.x - 150}px`
							this.tooltip.style.opacity = 1
						}, 100)
					}
				} else if (intersected.type === 'Mesh') {
					//console.log('POSITION XYZ', intersect.point)
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

							let top = clientY - tooltipRect.height - 20
							let left = clientX - domRect.x - 150
							this.tooltip.style.top = `${top}px`
							this.tooltip.style.left = `${left}px`
							this.tooltip.style.opacity = 1
							console.log(
								'Position',
								this.tooltip.style.top,
								this.tooltip.style.left
							)
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
				this.toggleTooltip('hide')
				this.updateHotspotsOpacity()
				this.previousMeshId = this.selectedMesh.uuid
				this.soundManager.playSoundAtIndex(opacity > 0.5 ? 1 : 0)
			}
		},
		onTooltipFormat(value) {
			let index = value > 50 ? 1 : 0
			return this.sliderTooltipsLabel[index]
		},
		displayHotspots() {
			this.immersiveScene.hotspots.forEach((hotspot, index) => {
				let point = this.hotspotManager.generate3DPosition(
					hotspot,
					SPHERE_RADIUS - 1
				)
				let spriteMaterial = new THREE.SpriteMaterial({
					map: this.hotspotManager.textures[hotspot.type],
					opacity: 1,
					transparent: true,
					depthWrite: true,
				})
				let sprite = new THREE.Sprite(spriteMaterial)
				sprite.scale.set(100, 100, 1)
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

.tooltip.popover .popover-inner {
	background: #f9f9f9;
	color: black;
	padding: 24px;
	border-radius: 5px;
	box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
}
.tooltip.popover .popover-arrow {
	border-color: #f9f9f9;
}

.range-container {
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: 200px;
  
  background: #a3e5c1;
}

.range {
  width: 100px;

  transform: rotate(-90deg);
}
</style>

<template>
	<div class="parent">
		<div class="scene" ref="scene3D"></div>

		<div v-if="immersiveScene">
			<h2 class="subtitle title-font header-immersive">
				{{ immersiveScene.name }}
			</h2>
		</div>

		<!-- Custom tooltip -->
		<div class="custom-tooltip" ref="tooltip" id="tooltip">
			<span class="tooltiptext">{{ focusedContent }}</span>
		</div>

		<div class="player-footer">
			<div class="columns is-mobile is-vcentered">
				<div class="column is-size-4 is-offset-4">
					<b-field>
						<b-slider
							type="is-white"
							tooltip-type="is-white"
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
import Bluebird from 'bluebird'
import { HotspotManager } from '../utils/HotspotManager'
import { SoundManager } from '../utils/SoundManager'

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
			hotspotScene: null,
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
			hotspots: [],
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
			selectedMesh: null,
			previousMeshId: '',
			immersiveScene: null,
			hotspotManager: new HotspotManager(),
			soundManager: null,
			isMute: false,
			focusedHotspot: {},
			tooltip: null,
			closeUpImage: '',
			isModalCloseUpVisible: false,
		}
	},
	mounted() {
		this.immersiveScene = require(`../data/sites/${this.site}/ConfigurationFiles_immgrandesalle.json`)
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
			return this.draggingValue == 1500 || this.draggingValue == 1700
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
				2158
			)

			this.renderer = new THREE.WebGLRenderer()
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.sortObjects = false
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			//Add events listeners
			this.el.addEventListener('mousedown', this.onDocumentMouseDown, false)
			this.el.addEventListener('touchstart', this.onDocumentMouseDown, false)
			this.el.addEventListener('wheel', this.onDocumentMouseWheel, false)
			this.el.addEventListener('mousemove', this.onMouseOver, false)
			this.el.addEventListener('touchstart', this.onMouseOver, false)
			this.el.addEventListener('click', this.onMouseOver, false)
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
					volume: soundFile.ambianceSound.volume
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

			this.lat = Math.max(-90, Math.min(90, this.lat))
			this.phi = THREE.MathUtils.degToRad(90 - this.lat)
			this.theta = THREE.MathUtils.degToRad(this.lon)

			this.camera.position.x = 100 * Math.sin(this.phi) * Math.cos(this.theta)
			this.camera.position.y = 100 * Math.cos(this.phi)
			this.camera.position.z = 100 * Math.sin(this.phi) * Math.sin(this.theta)

			this.camera.lookAt(this.scene.position)

			//this.renderer.render(this.hotspotScene, this.camera)
			//this.renderer.clearDepth()
			this.renderer.render(this.scene, this.camera)
			//this.renderer.render(this.hotspotScene, this.camera)
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
			this.geometry = new THREE.SphereGeometry(2058, 60, 40)
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
								depthWrite: false,
							})
							let mesh = new THREE.Mesh(this.geometry, material)
							mesh.uuid = layer.uniqueID
							mesh.renderOrder = index
							//layer['uuid'] = mesh.uuid
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
					this.selectedMesh = this.meshes[0]
					this.previousMeshId = this.selectedMesh.uuid
					//this.createHotpotScene()
					this.displayHotspots()
					this.updateHotspotsOpacity()
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
		onMouseOver(event) {
			event.preventDefault()

			let domRect = this.el.getBoundingClientRect()

			let onMouverOverEventX = event.clientX
				? event.clientX
				: event.touches[0].clientX

			let onMouverOverEventY = event.clientY
				? event.clientY
				: event.touches[0].clientY

			let mouse = new THREE.Vector2(
				((onMouverOverEventX - domRect.x) / this.el.clientWidth) * 2 - 1,
				-((onMouverOverEventY - domRect.y) / this.el.clientHeight) * 2 + 1
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
							this.tooltip.style.top = `${onMouverOverEventY -
								tooltipRect.height -
								20}px`
							this.tooltip.style.left = `${onMouverOverEventX -
								domRect.x -
								150}px`
							this.tooltip.style.opacity = 1
						}, 5)
						
					} else if (this.focusedHotspot.type == 'CloseUpHotspot') {
						if (
							(this.focusedHotspot.contentList.length == 1 &&
								event.type == 'click') ||
							event.type == 'touchstart'
						) {
							this.closeUpImage = `/assets/immersives/${this.site}/closeups/${this.focusedHotspot.contentList[0].value}.jpg`
							this.isModalCloseUpVisible = true
						}
					}
				}
			})

			return false
		},
		onSliderDragging() {
			let opacity = (this.draggingValue - 1500) / (1700 - 1500)
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
		displayHotspots() {
			this.immersiveScene.hotspots.forEach((hotspot, index) => {
				let point = this.hotspotManager.generate3DPosition(hotspot, 2047)
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
/*.scene {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	overflow: auto;
}*/

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

.header {
	color: white;
	opacity: 1;
}

.header-immersive {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: black;
	opacity: 0.8;
	color: white;
	padding: 1em;
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
	background:lightslategrey!important
}
</style>

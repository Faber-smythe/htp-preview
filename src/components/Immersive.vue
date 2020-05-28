<template>
	<div class="parent">
		<!-- Used to display 3D canvas which display the 3D scene-->
		<div class="scene" ref="scene3D"></div>

		<!-- Header navigation-->
		<div v-if="immersiveScene" class="header-immersive has-text-centered">
			<div class="columns">
				<div class="column">
					<h2 class="title-font header-title">
						<span>&nbsp;&nbsp;&nbsp;{{ immersiveTitle }}</span>
					</h2>
				</div>
			</div>

			<!-- Top left back button -->
			<b-button
				class="background-button is-large"
				icon-left="long-arrow-alt-left"
				style="position: absolute; top: -0.1em; left: 0.5em;"
				@click="goBack()"						
			>
			</b-button>

			<!-- Top right header logo -->
			<a href="/">
				<img
					v-if="!isSmartPhone"
					src="/img/logos/logo_histopad_white.png"
					alt="Logo HistoPad"
					style="width:5em; position: absolute; top: 0.8em; right: 1.5em;"
				/>
			</a>
		</div>

		

		<!-- Custom tooltip -->
		<div class="custom-tooltip" ref="tooltip" id="tooltip">
			<span class="tooltiptext noselect">{{ focusedContent }} </span>
		</div>

		<!-- Footer -->
		<div class="player-footer">
			<!-- Slider labels left and right-->
			<span class="slider-tooltip left-slider-tooltip noselect" @click="onSliderTooltipClick(0)">{{
				$t(sliderTooltipsLabel[0])
			}}</span>
			<span class="slider-tooltip right-slider-tooltip noselect" @click="onSliderTooltipClick(1)">{{
				sliderTooltipsLabel[1] == 'today' ? todayYear : $t(sliderTooltipsLabel[1]) 
			}}</span>

			<!-- Rooms dropdown -->
			<b-dropdown
				aria-role="list"
				position="is-top-right"
				class="footer-left-bottom"
				v-if="immersives && immersives.length > 0"
			>
				<button
					class="button is-large background-button"
					slot="trigger"
					@click="onMapDropDownClick"
				>
					<template>
						<b-icon icon="map-marked"></b-icon>
					</template>
				</button>

				<b-dropdown-item
					aria-role="listitem"
					v-for="immersive in immersives"
					:key="immersive.id"
					@click="onImmersiveChange(immersive)"
				>
					<strong>{{ $t(immersive.name) }}</strong> - {{ $t(immersive.site) }}
				</b-dropdown-item>
			</b-dropdown>

			<!-- Time slider -->
			<b-field class="time-slider">
				<input
					:disabled="loading"
					type="range"
					min="0"
					max="100"
					value="100"
					class="custom-slider"
					:style="isFirefox ? 'margin-bottom: 15px;' : ''"
					@input="onSliderDragging"
					v-model="draggingValue"
				/>
			</b-field>
			<div class="time-slider-background">
				<div
					class="background-slider"
					style="margin-left: 15px; margin-right: 15px;"
				></div>
			</div>

			<!-- Sound settings popover -->
			<v-popover
				offset="16"
				placement="bottom-start"
				class="footer-right-bottom"
				@hide="onSoundPopoverClick"
				:autoHide="true"
			>
				<!-- This will be the popover target (for the events and position) -->
				<b-button
					class="tooltip-target b3 is-large background-button"
					icon-left="volume-up"
					@click="onSoundPopoverClick"
				>
				</b-button>

				<!-- This will be the content of the popover -->
				<template slot="popover">
					<div class="slider-container">
						<b-button
							icon-left="volume-down"
							type="is-black"
							class="btn-volume-down is-large"
							@click="updateVolume(-5)"
							v-if="soundPopoverVisible"
						>
						</b-button>

						<input
							type="range"
							min="0"
							max="100"
							value="40"
							class="sound-slider"
							id="soundRange"
							orient="vertical"
							@input="onVolumeChange"
							v-model="soundVolume"
						/>

						<b-button
							icon-left="volume-up"
							type="is-black"
							class="btn-volume-up is-large"
							@click="updateVolume(5)"
							v-if="soundPopoverVisible"
						>
						</b-button>
					</div>
				</template>
			</v-popover>
		</div>

		

		<!-- Modal for close up display -->
		<b-modal :active.sync="isModalCloseUpVisible">
			<!--<p class="image" v-if="closeUpImage">
				<img :src="closeUpImage" :alt="focusedContent" style="height: 100%; width: 100%; object-fit: contain"/>
			</p>-->
			<div v-if="immersiveScene" class="header-immersive has-text-centered">
				<h2 class="title-font header-title" v-html="$t(closeUpTitle)"></h2>
			</div>

			<div style="height: 100%; width:100%">
				<img
					:src="closeUpImage"
					:alt="focusedContent"
					style="max-width: 100%; max-height: 100%; margin-left: auto; margin-right: auto; display: block;"
				/>
			</div>
		</b-modal>
		<img id="closeUpImg" style="display:none;" />
	</div>
</template>

<script>
import Vue from 'vue'
import * as THREE from 'three'

import SpriteText from 'three-spritetext'

import TWEEN from '@tweenjs/tween.js'
import Bluebird from 'bluebird'
import { HotspotManager } from '../utils/HotspotManager'
import { SoundManager } from '../utils/SoundManager'
import { ImmersiveManager } from '../utils/ImmersiveManager'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls'
//import { OrbitControls } from '../utils/OrbitControls'

import { utilsMixin } from '../utils/mixins'

import sites from '../data/sites.json'

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

const SPHERE_RADIUS = 2048

export default {
	name: 'Immersive',
	mixins: [utilsMixin],
	props: {
		linkLabel: String,
		site: String,
		foundImmersive: Object,
	},
	data() {
		return {
			selectedImmersive: null,
			isEnabled: false,
			width: window.innerWidth,
			height: window.innerHeight,
			ratio: window.innerWidth / window.innerHeight,
			renderer: null,
			camera: null,
			fov: 60,
			controls: null,
			scene: null,
			rayCaster: null,
			geometry: null,
			material: null,
			el: null,
			canvas: null,
			textureLoader: new THREE.TextureLoader(),
			isUserInteracting: false,
			isMenuVisible: false,
			scaling: false,
			manager: null,
			draggingValue: 100,
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
			closeUpTitle: '',
			isModalCloseUpVisible: false,
			loadingComponent: null,
			closeUpImages: [],
			sliderTooltipsLabel: ['', ''],
			soundVolume: 0,
			isGeometryUpdated: false,
			immersives: [],
			timeSpiral: null,
			timeSpiralMaterial: null,
			soundPopoverVisible: false,
			loading: true,
			dx: 0.0,
			dy: 0.0,
			touchZoomDistanceEnd: 0.0,
			touchZoomDistanceStart: 0.0,
		}
	},
	mounted() {
		this.$i18n.locale = !localStorage.getItem('locale')
			? this.navigatorLanguage
			: localStorage.getItem('locale')

		this.selectedImmersive = JSON.parse(JSON.stringify(this.foundImmersive))
		this.loadImmersive()
	},
	beforeDestroy() {
		this.unloadImmersive()
		if (this.controls) this.controls.dispose()
	},
	computed: {
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
		leftSliderStyle() {
			if (this.isSmartPhone) {
				if (this.isLandscape) {
					return 'font-size:0.8em; position:absolute; bottom: 0.4em; left:20%; text-align:center; width: 100px;'
				} else {
					return 'font-size:0.8em; position:absolute; bottom: 0.4em; left:13%; text-align:center; width: 100px;'
				}
			} else {
				return 'font-size:0.8em; position:absolute; bottom: 0.4em; left:31%; text-align:center; width: 100px;'
			}
		},
		rightSliderStyle() {
			if (this.isSmartPhone) {
				if (this.isLandscape) {
					return 'font-size:0.8em; position:absolute; bottom: 0.4em; right:20%; text-align:center; width: 100px;'
				} else {
					return 'font-size:0.8em; position:absolute; bottom: 0.4em; right:13%; text-align:center; width: 100px;'
				}
			} else {
				return 'font-size:0.8em; position:absolute; bottom: 0.4em; right:31%; text-align:center; width: 100px;'
			}
		},
		timeSliderBackgroundStyle() {
			let style = this.isSmartPhone
				? 'width: 50%; margin-left: auto; margin-right: auto; margin-bottom: 30px;'
				: 'width: 33%; margin-left: auto; margin-right: auto; margin-bottom: 30px;'
			return style
		},
		timeSliderStyle() {
			let style = this.isSmartPhone
				? 'margin-left: auto; margin-right: auto; width: 50%'
				: 'margin-left: auto; margin-right: auto; width: 33%'
			return style
		},
	},
	methods: {
		loadImmersive() {

			this.immersives = sites
				.find((s) => {
					return s.site == this.site
				}).immersives
			
			this.immersiveScene = JSON.parse(
				JSON.stringify(
					require(`../data/sites/${this.selectedImmersive.site}/${this.selectedImmersive.file}`)
				)
			)

			//Loading only text hotspot and close ups
			this.immersiveScene.hotspots = this.immersiveScene.hotspots.filter(
				(hotspot) => {
					return (
						hotspot.type === 'TextHotspot' ||
						(hotspot.type === 'CloseUpHotspot' &&
							hotspot.contentList.length == 1)
					)
				}
			)

			//Load slider tooltips label
			this.sliderTooltipsLabel = this.immersiveScene.layers.map((layer) => {
				return layer.localizedTimestampTitle.replace('${', '').replace('}', '')
			})

			//Load other available immersives for this site
			this.immersives = sites
				.find((s) => {
					return s.site == this.site
				})
				.immersives.filter((immersive) => {
					return immersive.id !== this.immersiveScene.name
				})

		
			this.init()
		},
		unloadImmersive() {
			if (this.scene) {
				//Disposal children materials and geometry
				this.scene.children.forEach((child) => {
					if (child.geometry && child.material) {
						child.geometry.dispose()
						child.material.dispose()
					}
				})

				//Removing children (meshes and sprites)
				while (this.scene.children.length > 0) {
					this.scene.remove(this.scene.children[0])
				}

				this.timeSpiralMaterial.dispose()

				this.scene.dispose()
				this.renderer.renderLists.dispose()

				//Removing geometry, textures, and materials
				this.geometry.dispose()
				this.textures.forEach((texture) => {
					texture.dispose()
				})
			}

			this.soundManager.unloadSounds()
		},
		init() {
			this.el = this.$refs['scene3D']
			this.tooltip = this.$refs['tooltip']

			this.textureLoader.setCrossOrigin('anonymous')
			this.soundManager = new SoundManager()

			this.initScene()
			this.loadAssets()
			this.loadCloseUps()
			this.animate()
			window.addEventListener('resize', this.onWindowResize, false)
		},
		initScene() {
			if (this.scene) {
				return
			}
			this.scene = new THREE.Scene()
			this.rayCaster = new THREE.Raycaster()

			this.camera = new THREE.PerspectiveCamera(
				this.fov,
				this.el.clientWidth / this.el.clientHeight,
				1,
				5000
			)
			this.camera.position.set(0, 0, 10)
			this.camera.target = new THREE.Vector3(0, 0, 0)

			this.renderer = new THREE.WebGLRenderer()
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.sortObjects = false
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			//this.controls.enableDamping = true
			this.controls.enableZoom = false
			this.controls.enablePan = false
			this.controls.rotateSpeed = -0.5

			/*let axesHelper = new THREE.AxesHelper(5)
			this.scene.add(axesHelper)*/

			//Add events listeners
			this.el.addEventListener('mousedown', this.onPointerStart, false)
			this.el.addEventListener('mousemove', this.onPointerMove, false)
			this.el.addEventListener('mouseup', this.onPointerUp, false)

			this.el.addEventListener('touchstart', this.onPointerStart, true)
			this.el.addEventListener('touchmove', this.onPointerMove, true)
			this.el.addEventListener('touchend', this.onPointerUp, true)

			this.el.addEventListener('click', this.onClick, false)
			this.el.addEventListener('touchstart', this.onClick, false)
			this.el.addEventListener('wheel', this.onDocumentMouseWheel, false)
		},
		initAmbient() {
			return new Promise((resolve, reject) => {
				let soundFiles = this.immersiveScene.layers.filter((layer) => {
					return (
						layer.ambianceSound 
					)
				})

				soundFiles = soundFiles.map((soundFile) => {
					let soundURL = soundFile.ambianceSound.fileName !== '' ? `/assets/immersives/${this.selectedImmersive.site}/sounds/${soundFile.ambianceSound.fileName}.mp3`
						: `/assets/sounds/default.mp3`

					soundFile.ambianceSound.volume = soundFile.ambianceSound.fileName !== '' ? soundFile.ambianceSound.volume : 0.05

					return {
						url: soundURL,
						volume: soundFile.ambianceSound.volume,
					}
				})

				if (soundFiles && soundFiles.length > 0) {
					this.soundVolume = soundFiles[soundFiles.length - 1].volume * 100					
				}

				this.soundManager
					.init(soundFiles)
					.then(() => {
						this.soundManager.playSoundAtIndex(this.meshes.length - 1)
						this.soundManager.setVolume(soundFiles[soundFiles.length - 1].volume)
						resolve(true)
					})
					.catch((error) => {
						console.error('Error when playing sound:', error)
						reject(error)
					})
			})
		},
		loadCloseUps() {
			let closeUps = this.immersiveScene.hotspots.filter((hotspot) => {
				return (
					hotspot.type === 'CloseUpHotspot' && hotspot.contentList.length === 1
				)
			})

			let image = document.getElementById('closeUpImg')

			this.closeUpImages = []

			closeUps.forEach((closeUp) => {
				let url = `/assets/immersives/${this.selectedImmersive.site}/closeups/${closeUp.contentList[0].value}.jpg`
				console.log('URL', url)
				let closeUpImage = new Image()
				closeUpImage.onload = () => {
					image.src = this.src
				}
				closeUpImage.src = url
			})
		},
		animate(time) {
			requestAnimationFrame(this.animate)

			TWEEN.update(time)

			this.controls.update()

			this.renderer.render(this.scene, this.camera)
		},
		loadAssets() {
			this.displayLoading(true)

			this.geometry = new THREE.SphereGeometry(SPHERE_RADIUS + 30, 32, 32)
			this.geometry.scale(-1, 1, 1)
			//Load textures for hotspots sprites
			this.hotspotManager.loadHotspotTextures()

			this.meshes = []
			this.textures = []
			this.materials = []

			Bluebird.each(this.immersiveScene.layers, (layer, index) => {
				return new Promise((resolve, reject) => {
					let textureURL = `/assets/immersives/${this.selectedImmersive.site}/${layer.uniqueID}.jpg`

					this.textureLoader.load(
						textureURL,
						(texture) => {
							let material = new THREE.MeshBasicMaterial({
								map: texture,
								transparent: true,
								side: THREE.DoubleSide,
								depthWrite: true,
								blending: THREE.NormalBlending,
								opacity: 0,
							})

							let mesh = new THREE.Mesh(this.geometry, material)
							mesh.uuid = layer.uniqueID
							mesh.renderOrder = index
							this.meshes.push(mesh)
							this.textures.push(texture)
							this.materials.push(material)
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
					this.meshes[this.meshes.length - 1].material.opacity = 1
					if (this.meshes.length > 1) {
						for (let i = 0; i < this.meshes.length - 1; i++) {
							this.meshes[i].material.opacity = 0
						}
					}

					this.selectedMesh = this.meshes[this.meshes.length - 1]
					this.previousMeshId = this.selectedMesh.uuid
					this.displayHotspots()
					this.updateHotspotsOpacity()
					this.renderer.compile(this.scene, this.camera)
					this.initSlider()
				
					return this.initAmbient()
				})
				.then(() => {
					//Load texture for time spiral
					this.textureLoader.load(`/img/spirales/${this.selectedImmersive.id}.png`, (texture) => {

						this.timeSpiralMaterial = new THREE.MeshBasicMaterial({
							map: texture,
							transparent: true,
							side: THREE.DoubleSide,
							opacity: 1
						})
						this.timeSpiralMaterial.needsUpdate = true

						let plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), this.timeSpiralMaterial)
						plane.overdraw = true
						plane.rotateX(-Math.PI / 2)
						plane.rotateZ(Math.PI / 2)
						plane.position.set(0, -400, 0)
						this.scene.add(plane)

						this.spriteSpiralText = new SpriteText(this.$t('spiral_label'), 10)
						this.spriteSpiralText.color = 'white'
						this.spriteSpiralText.backgroundColor = 'rgba(0,0,0,0.0)';
						this.spriteSpiralText.fontFace = 'Poppins'
						this.spriteSpiralText.position.set(0, -350, 0)
						this.scene.add(this.spriteSpiralText)
					})
					this.displayLoading(false)
				})
				.catch((error) => {
					console.error('Error when loading texture:', error)
					this.displayLoading(false)
				})
		},
		displayLoading(isLoading) {
			this.loading = isLoading
			if (isLoading) {
				this.loadingComponent = this.$buefy.loading.open({
					container: this.el,
				})
			} else {
				this.loadingComponent.close()
			}
		},
		initSlider() {
			this.stepLength = 100 / this.meshes.length
			this.stepsValue = new Array(this.meshes.length)
			let k = 0
			for (let i = 0; i <= 100; i += this.stepLength) {
				this.stepsValue[k] = i
				k++
			}
		},
		onWindowResize() {
			this.camera.aspect = this.el.clientWidth / this.el.clientHeight
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
			this.camera.updateProjectionMatrix()
		},
		onPointerStart(event) {
			event.preventDefault()
			this.isUserInteracting = true
			if (event.touches && event.touches.length == 2) {
				this.controls.enableRotate = false
				this.dx = event.touches[0].pageX - event.touches[1].pageX
				this.dy = event.touches[0].pageY - event.touches[1].pageY
				this.touchZoomDistanceEnd = Math.sqrt(
					this.dx * this.dx + this.dy * this.dy
				)
			}
		},
		onPointerMove(event) {
			event.preventDefault()
			if (this.isUserInteracting) {
				this.toggleTooltip('hide')
			}
			if (event.touches && event.touches.length == 2) {
				this.dx = event.touches[0].pageX - event.touches[1].pageX
				this.dy = event.touches[0].pageY - event.touches[1].pageY
				this.touchZoomDistanceEnd = Math.sqrt(
					this.dx * this.dx + this.dy * this.dy
				)

				let factor = this.touchZoomDistanceStart / this.touchZoomDistanceEnd
				this.touchZoomDistanceStart = this.touchZoomDistanceEnd

				if (factor !== 0) {
					this.fov = this.camera.fov * factor
					this.setCameraZoom()
				}
			} else {
				this.controls.enableRotate = true
			}
		},
		onPointerUp() {
			this.isUserInteracting = false
			this.controls.enableRotate = true
		},
		onDocumentMouseWheel(event) {
			this.fov = this.camera.fov + event.deltaY * 0.05
			this.setCameraZoom()
		},
		setCameraZoom() {
			this.toggleTooltip('hide')
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
							let file = this.focusedHotspot.contentList[0].value
							let closeUp = this.immersiveScene.closeUps.find((closeUp) => {
								return closeUp.fileName == file
							})
							this.closeUpTitle = closeUp.cartelDescription.title
								.replace('${', '')
								.replace('}', '')
							this.closeUpImage = `/assets/immersives/${this.selectedImmersive.site}/closeups/${file}.jpg`
							this.isModalCloseUpVisible = true
						}
					} else if (this.focusedHotspot.type == 'TextHotspot') {
						//Getting spherical coordinates of the targeted hotspots
						let spherical = new THREE.Spherical().setFromCartesianCoords(
							intersect.point.x,
							intersect.point.y,
							intersect.point.z
						)

						//Calculating camera position (opposite from targeted hotspot position)
						//Polar coordinates
						let phi = Math.PI - spherical.phi
						let theta = Math.PI + spherical.theta
						//Cartesian coordinates
						let targetPosition = new THREE.Vector3().setFromSphericalCoords(
							10,
							phi,
							theta
						)

						let that = this

						//From and to positions according to clicked hotspot
						let fromPosition = {
							x: this.camera.position.x,
							y: this.camera.position.y,
							z: this.camera.position.z,
						}

						let to = {
							x: targetPosition.x,
							y: targetPosition.y,
							z: targetPosition.z,
						}
						//Tweening animation for camera position
						new TWEEN.Tween(fromPosition)
							.to(to, 200)
							.easing(TWEEN.Easing.Quadratic.InOut)
							.onUpdate(function(event) {
								if (that.camera && event) {
									that.camera.position.x = event.x
									that.camera.position.y = event.y
									that.camera.position.z = event.z
								}
							})
							.onComplete(function() {
								//Display hotspot's tooltip when animation is completed
								that.toggleTooltip('show')
								let tooltipRect = that.tooltip.getBoundingClientRect()
								let top = domRect.height / 2 - tooltipRect.height - 20
								let left = domRect.width / 2 - domRect.x - 150
								that.tooltip.style.top = `${top}px`
								that.tooltip.style.left = `${left}px`
								that.tooltip.style.opacity = 1
							})
							.start()
					}
				}
			})
		},
		onSliderDragging() {
			let opacity = this.draggingValue / 100

			this.meshes[0].material.opacity = 1 - opacity
			this.meshes[1].material.opacity = 0 + opacity
			this.timeSpiralMaterial.opacity = 0 + opacity
			this.spriteSpiralText.material.opacity = 0 + opacity

			this.selectedMesh = opacity > 0.5 ? this.meshes[1] : this.meshes[0]

			if (this.previousMeshId !== this.selectedMesh.uuid) {
				this.toggleTooltip('hide')
				this.updateHotspotsOpacity()
				this.previousMeshId = this.selectedMesh.uuid

				this.soundVolume = this.immersiveScene.layers[opacity > 0.5 ? 1 : 0].ambianceSound.volume * 100
				this.soundManager.playSoundAtIndex(opacity > 0.5 ? 1 : 0)
			}
		},
		onTooltipFormat(value) {
			let index = value > 50 ? 1 : 0
			return this.sliderTooltipsLabel[index]
		},
		displayHotspots() {
			this.hotspots = []
			this.immersiveScene.hotspots.forEach((hotspot, index) => {
				let point = this.hotspotManager.generate3DPosition(
					hotspot,
					SPHERE_RADIUS
				)
				hotspot['point'] = point
				let spriteMaterial = new THREE.SpriteMaterial({
					map: this.hotspotManager.textures[hotspot.type],
					opacity: 1,
					transparent: true,
					depthWrite: true,
				})
				let sprite = new THREE.Sprite(spriteMaterial)
				sprite.scale.set(100, 100, 100)
				sprite.position.copy(point)
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
			if (this.selectedMesh.uuid.indexOf('new_layer1') > -1) {
				return false
			}
			if (hotspot && hotspot.layers && hotspot.layers.length > 0) {
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
		onVolumeChange() {
			this.soundVolume = Number(this.soundVolume)
			this.soundManager.setVolume(this.soundVolume / 100)
		},
		updateVolume(value) {
			this.soundVolume += Number(value)
			if (this.soundVolume > 100) {
				this.soundVolume = 100
			} else if (this.soundVolume < 0) {
				this.soundVolume = 0
			}
			this.soundManager.setVolume(this.soundVolume / 100)
		},
		toggleTooltip(command) {
			this.tooltip.style.display = command === 'show' ? 'block' : 'none'
			this.showTooltip = command === 'show'
		},
		getHotspotLabel(hotspot) {
			if (hotspot.contentList && hotspot.contentList.length > 0) {
				let key = hotspot.contentList[0].value
					.replace('${', '')
					.replace('}', '')

				return key
			} else {
				return ''
			}
		},
		onImmersiveChange(immersive) {
			this.toggleTooltip('hide')
			this.draggingValue = 100
			let url = `/teaser/${this.site}/immersive/${immersive.id}`
			window.history.replaceState(null, null, url)
			this.selectedImmersive = immersive
			this.unloadImmersive()
			this.camera.position.set(0, 0, 10)
			this.loadImmersive()
		},
		onSoundPopoverClick() {
			if (this.isSafariOrIOS) {
				setTimeout(() => {
					this.soundPopoverVisible = !this.soundPopoverVisible
				}, 100)
			} else {
				this.soundPopoverVisible = !this.soundPopoverVisible
			}
		},
		onMapDropDownClick() {
			if (this.isSmartPhone) {
				this.toggleTooltip('hide')
			}
		},
		onSliderTooltipClick(index) {
			this.draggingValue = index == 1 ? 100 : 0
			this.onSliderDragging()
		}
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
	padding: 0.2em;
	background: rgb(0, 0, 0);
	background: linear-gradient(
		0deg,
		rgba(0, 0, 0, 1) 0%,
		rgba(0, 0, 0, 0) 100%,
		rgba(0, 0, 0, 0) 100%
	);
	color: white;
}

.modal-close {
	background: none;
	height: 40px;
	position: fixed;
	left: 10px !important;
	top: 10px !important;
	width: 40px;
}

.background-button,
.background-button:hover,
.background-button:focus {
	background: rgba(0, 0, 0, 0);
	color: white;
	border-color: transparent;
}

.custom-tooltip {
	position: absolute;
	width: 300px;
	padding: 5px;
	z-index: 5;
	left: 50px;
	border-radius: 3px;
	font-size: 0.75rem;
	background-color: black;
	color: white;
	display: none;
}

.header-immersive {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background: rgb(0, 0, 0);
	background: linear-gradient(
		180deg,
		rgba(0, 0, 0, 1) 0%,
		rgba(0, 0, 0, 0.5) 25%,
		rgba(0, 0, 0, 0) 80%
	);
	opacity: 0.9;
	padding: 0.7em;
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

.closeup-title {
	font-size: 1.5em;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
}

.footer-left-bottom {
	margin: 0.5em;
	position: fixed;
	left: 0.5em;
	bottom: 0.5em;
}

.footer-right-bottom {
	position: fixed;
	bottom: 0.8em;
	right: 1.5em;
}

.tooltiptext {
	font-size: 1rem;
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

.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
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

.slider-container {
	display: flex;
	height: auto;
	width: 6rem;
	background: black;
	border-radius: 3px;
	padding: 1em;
}

input[type='range'].sound-slider {
	-webkit-appearance: none;
	width: 1rem;
	height: 8rem;
	border-radius: 5px;
	background: #ccc;
	outline: none;
	writing-mode: bt-lr; /* IE */
	margin-top: 0.6rem;
	margin-bottom: 0.6rem;
	-webkit-appearance: slider-vertical; /* WebKit */
}

.btn-volume-up {
	position: fixed;
	top: 0em;
	left: 1.7em;
}

.btn-volume-down {
	position: fixed;
	bottom: 0em;
	left: 1.7em;
}

input[type='range'].custom-slider::-webkit-slider-runnable-track {
	width: 100%;
	height: 3.4px;
	cursor: pointer;
	background: white;
	border-radius: 1.3px;
	margin: 5px;
}

input[type='range'].custom-slider:focus::-webkit-slider-runnable-track {
	background: white;
}

.time-slider {
	margin-left: auto;
	margin-right: auto;
	width: 33%;
}

.time-slider-background {
	width: 33%;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 30px;
}

/** Slider tooltips */
.slider-tooltip {
	cursor: pointer;
}

.left-slider-tooltip {
	font-size: 0.8em;
	position: absolute;
	bottom: 0.4em;
	left: 31%;
	text-align: center;
	width: 100px;
}

.right-slider-tooltip {
	font-size: 0.8em;
	position: absolute;
	bottom: 0.4em;
	right: 31%;
	text-align: center;
	width: 100px;
}

.background-slider {
	height: 3.4px;
	background: rgba(185, 185, 185, 0.5);
	border-radius: 1.3px;
	margin-left: 22px;
	margin-right: 22px;
	margin-top: -20px;
}

input[type='range'].custom-slider {
	-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
	width: 100%; /* Specific width is required for Firefox. */
	background: transparent; /* Otherwise white in Chrome */
}

input[type='range'].custom-slider:focus {
	outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range'].custom-slider::-ms-track {
	width: 100%;
	cursor: pointer;

	/* Hides the slider so custom styles can be added */
	background: transparent;
	border-color: transparent;
	color: transparent;
}

input[type='range'].custom-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: none;
	height: 40px;
	width: 21px;
	background: white;
	background: url('/img/time_cursor_thin.png') no-repeat;
	border-radius: 0 !important;
	margin-top: -40px;
}

input[type='range'].custom-slider::-moz-range-thumb {
	height: 40px;
	width: 21px;
	border: 0;
	background: url('/img/time_cursor_thin.png') no-repeat;
	cursor: pointer;
}

/* All the same stuff for IE */
input[type='range'].custom-slider::-ms-thumb {
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	border: 1px solid #000000;
	height: 26px;
	width: 10px;
	border-radius: 3px;
	background: #ffffff;
	cursor: pointer;
}

input[type='range'].custom-slider::-webkit-slider-runnable-track {
	width: 100%;
	height: 3.4px;
	cursor: pointer;
	background: rgba(185, 185, 185, 0);
	border-radius: 1.3px;
	margin: 5px;
}

input[type='range'].custom-slider:focus::-webkit-slider-runnable-track {
	background: rgba(185, 185, 185, 0);
}

input[type='range'].custom-slider::-moz-range-track {
	width: 100%;
	height: 3.4px;
	cursor: pointer;
	background: rgba(185, 185, 185, 0);
	margin-bottom: 20px;
	border-radius: 1.3px;
}

input[type='range'].custom-slider:focus::-moz-range-track {
	background: rgba(185, 185, 185, 0);
}

input[type='range'].custom-slider::-ms-track {
	width: 100%;
	height: 3.4px;
	cursor: pointer;
	background: transparent;
	border-color: transparent;
	border-width: 16px 0;
	margin: 5px;
	color: transparent;
}

input[type='range'].custom-slider::-ms-fill-lower {
	background: rgba(185, 185, 185, 0);
	border-radius: 2.6px;
}
input[type='range'].custom-slider:focus::-ms-fill-lower {
	background: rgba(185, 185, 185, 0);
}
input[type='range'].custom-slider::-ms-fill-upper {
	background: rgba(185, 185, 185, 0);
	border-radius: 2.6px;
}
input[type='range'].custom-slider:focus::-ms-fill-upper {
	background: rgba(185, 185, 185, 0);
}

@media screen and (min-width: 501px) and (max-width: 823px) {
	.left-slider-tooltip {
		font-size: 0.8em;
		position: absolute;
		bottom: 0.4em;
		left: 20%;
		text-align: center;
		width: 100px;
	}

	.right-slider-tooltip {
		font-size: 0.8em;
		position: absolute;
		bottom: 0.4em;
		right: 20%;
		text-align: center;
		width: 100px;
	}

	.time-slider {
		margin-left: auto;
		margin-right: auto;
		width: 50%;
	}

	.time-slider-background {
		width: 50%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 30px;
	}

	input[type='range'].sound-slider {
		-webkit-appearance: none;
		width: 2rem;
		height: 12.5rem;
		border-radius: 5px;
		background: #ccc;
		outline: none;
		margin-top: 0.6rem;
		margin-bottom: 0.6rem;
		writing-mode: bt-lr; /* IE */
		-webkit-appearance: slider-vertical; /* WebKit */
	}
}

@media screen and (max-width: 501px) {
	.left-slider-tooltip {
		font-size: 0.8em;
		position: absolute;
		bottom: 0.4em;
		left: 17%;
		text-align: center;
		width: 100px;
	}

	.right-slider-tooltip {
		font-size: 0.8em;
		position: absolute;
		bottom: 0.4em;
		right: 17%;
		text-align: center;
		width: 100px;
	}

	.time-slider {
		margin-left: auto;
		margin-right: auto;
		width: 50%;
	}

	.time-slider-background {
		width: 50%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 30px;
	}

	input[type='range'].sound-slider {
		-webkit-appearance: none;
		width: 2rem;
		height: 12.5rem;
		border-radius: 5px;
		background: #ccc;
		outline: none;
		margin-top: 0.6rem;
		margin-bottom: 0.6rem;
		writing-mode: bt-lr; /* IE */
		-webkit-appearance: slider-vertical; /* WebKit */
	}
}
</style>

<template>
	<div class="parent">
		<!-- Used to display 3D canvas which display the 3D scene-->
		<div class="scene" ref="scene3D"></div>

		<!-- Header navigation-->
		<div v-if="immersiveScene" class="header-immersive has-text-centered">
			<div class="columns">
				<div class="column">
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
			</div>
		</div>

		<!-- Custom tooltip -->
		<div class="custom-tooltip" ref="tooltip" id="tooltip">
			<span class="tooltiptext">{{ focusedContent }} </span>
		</div>

		<!-- Footer -->
		<div class="player-footer">
			<div class="columns is-mobile is-vcentered">
				<span
					:style="
						isSmartPhone
							? 'font-size:0.8em; position:absolute; bottom: 0.4em; left:25%;'
							: 'font-size:0.8em; position:absolute; bottom: 0.4em; left:33%;'
					"
					>{{ $t(sliderTooltipsLabel[0]) }}</span
				>
				<span
					:style="
						isSmartPhone
							? 'font-size:0.8em; position:absolute; bottom: 0.4em; right:25%;'
							: 'font-size:0.8em; position:absolute; bottom: 0.4em; right:33%;'
					"
					>{{ $t(sliderTooltipsLabel[1]) }}</span
				>
				<div class="column">
					<b-dropdown
						aria-role="list"
						position="is-top-right"
						style="margin: 0.5em;"
						v-if="immersives && immersives.length > 0"
					>
						<!--<button
							class="button is-black"
							slot="trigger"
							slot-scope="{ active }"
						>
							<template>
								<b-icon icon="map-marked"></b-icon>
								<b-icon :icon="active ? 'caret-up' : 'caret-down'"></b-icon>
							</template>
						</button>-->

						<button class="button is-black" slot="trigger">
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
							{{ $t(immersive.name) }}
						</b-dropdown-item>
					</b-dropdown>
				</div>

				<div
					:class="isSmartPhone ? 'column is-half' : 'column is-one-third'"
					v-if="
						immersiveScene &&
							immersiveScene.layers &&
							immersiveScene.layers.length > 0
					"
				>
					<b-field style="margin-left: 0.5em; margin-right: 0.5em;">
						<input
							type="range"
							min="0"
							max="100"
							value="0"
							class="custom-slider"
							style="width: 100%"
							@input="onSliderDragging"
							v-model="draggingValue"
						/>
					</b-field>
				</div>

				<div class="column">
					<v-popover offset="16" placement="bottom-center">
						<!-- This will be the popover target (for the events and position) -->
						<b-button
							class="tooltip-target b3 is-black is-large"
							icon-left="volume-up"
						>
						</b-button>

						<!-- This will be the content of the popover -->
						<template slot="popover">
							<div class="slider-container">
								<input
									type="range"
									min="0"
									max="100"
									value="40"
									class="slider"
									id="soundRange"
									orient="vertical"
									:style="
										isSmartPhone
											? 'height: 15em; width:16px;'
											: 'height: 10em; width:8px;'
									"
									@input="onVolumeChange"
									v-model="soundVolume"
								/>

								<b-button
									icon-left="volume-up"
									type="is-black"
									style="position:fixed; top: 0.1em;; left: 2.3em;"
									@click="udpdateVolume(5)"
								>
								</b-button>

								<b-button
									icon-left="volume-down"
									type="is-black"
									style="position:fixed; bottom: 0.1em; left:2.3em;"
									@click="udpdateVolume(-5)"
								>
								</b-button>
							</div>
						</template>
					</v-popover>
				</div>
			</div>
		</div>

		<!--<LanguageSwitcher v-if="!isSmartPhone" style="position: absolute; top: 1em; right: 1em;" />-->

		<img
			v-if="!isSmartPhone"
			src="/img/logos/logo_histopad_white.png"
			alt="Logo HistoPad"
			:style="
				!isSmartPhone
					? 'width:5em; position: fixed; margin:1.5em;'
					: 'width:5em; position: fixed; margin:1.5em; bottom: 0em;'
			"
		/>

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
import Bluebird from 'bluebird'
import { HotspotManager } from '../utils/HotspotManager'
import { SoundManager } from '../utils/SoundManager'
import { ImmersiveManager } from '../utils/ImmersiveManager'
//import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls'
import { OrbitControls } from '../utils/OrbitControls'


import { utilsMixin } from '../utils/mixins'

import sites from '../data/sites.json'

// eslint-disable-next-line no-unused-vars
import LanguageSwitcher from './LanguageSwitcher'

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

const SPHERE_RADIUS = 2048

export default {
	name: 'Immersive',
	mixins: [utilsMixin],
	props: {
		site: String,
		immersiveFileName: String,
	},
	components: {
		//LanguageSwitcher,
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
			closeUpTitle: '',
			isModalCloseUpVisible: false,
			loadingComponent: null,
			closeUpImages: [],
			sliderTooltipsLabel: ['', ''],
			soundVolume: 40,
			isGeometryUpdated: false,
			immersives: [],
			immersiveFile: '',
		}
	},
	mounted() {
		this.immersiveFile = new String(this.immersiveFileName)
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
	},
	methods: {
		loadImmersive() {
			this.immersiveScene = JSON.parse(
				JSON.stringify(
					require(`../data/sites/${this.site}/${this.immersiveFile}`)
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
			this.initAmbient()
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
			this.camera.target = new THREE.Vector3( 0, 0, 0 )

			this.renderer = new THREE.WebGLRenderer()
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.sortObjects = false
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)

			this.el.appendChild(this.renderer.domElement)

			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			//this.controls.enableDamping = true
			this.controls.enableZoom = false
			this.controls.rotateSpeed = -0.5

			this.controls.addEventListener('change', (event) => {
				console.log(
					'controls change',
					event.target.getAzimuthalAngle(),
					event.target.getPolarAngle(),
					event.target.object.position,
					event.target.object.rotation
				)
			})

			/*let axesHelper = new THREE.AxesHelper(5)
			this.scene.add(axesHelper)*/

			//Add events listeners
			this.el.addEventListener('mousedown', this.onPointerStart, false)
			this.el.addEventListener('mousemove', this.onPointerMove, false)
			this.el.addEventListener('mouseup', this.onPointerUp, false)

			this.el.addEventListener('touchstart', this.onPointerStart, false)
			this.el.addEventListener('touchmove', this.onPointerMove, false)
			this.el.addEventListener('touchend', this.onPointerUp, false)

			this.el.addEventListener('click', this.onClick, false)
			this.el.addEventListener('touchstart', this.onClick, false)
			this.el.addEventListener('wheel', this.onDocumentMouseWheel, false)
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

			if (soundFiles && soundFiles.length > 0) {
				this.soundVolume = soundFiles[0].volume * 100
			}

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

			this.closeUpImages = []

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

			this.controls.update()
			this.renderer.render(this.scene, this.camera)
		},
		loadAssets() {
			this.displayLoading(true)

			this.geometry = new THREE.SphereGeometry(SPHERE_RADIUS + 30, 32, 32)
			this.geometry.scale(-1, 1, 1)
			this.hotspotManager.loadHotspotTextures()

			this.meshes = []
			this.textures = []
			this.materials = []

			Bluebird.each(this.immersiveScene.layers, (layer, index) => {
				return new Promise((resolve, reject) => {
					let textureURL = `/assets/immersives/${this.site}/${layer.uniqueID}.jpg`
					console.log('Loading texture', textureURL)

					this.textureLoader.load(
						textureURL,
						(texture) => {
							console.log('Texture loaded!', textureURL)
							let material = new THREE.MeshBasicMaterial({
								map: texture,
								transparent: true,
								side: THREE.DoubleSide,
								depthWrite: true,
								blending: THREE.NormalBlending,
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
					this.meshes[0].material.opacity = 1
					if (this.meshes.length > 1) {
						for (let i = 1; i < this.meshes.length; i++) {
							this.meshes[i].material.opacity = 0
						}
					}

					this.selectedMesh = this.meshes[0]
					this.previousMeshId = this.selectedMesh.uuid
					this.displayHotspots()
					this.updateHotspotsOpacity()
					this.renderer.compile(this.scene, this.camera)
					this.displayLoading(false)

					this.initSlider()
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
		},
		onPointerMove(event) {
			event.preventDefault()
			if (this.isUserInteracting) {
				this.toggleTooltip('hide')
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
							this.closeUpImage = `/assets/immersives/${this.site}/closeups/${file}.jpg`
							this.isModalCloseUpVisible = true
						}
					} else if (this.focusedHotspot.type == 'TextHotspot') {
						/**
						 * lat = Math.max( - 85, Math.min( 85, lat ) );
							phi = THREE.MathUtils.degToRad( 90 - lat );
							theta = THREE.MathUtils.degToRad( lon );

							camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
							camera.target.y = 500 * Math.cos( phi );
							camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

							camera.lookAt( camera.target );
						 */
						//this.camera.lookAt(intersect.point)

						let spherical = new THREE.Spherical().setFromCartesianCoords(
							intersect.point.x,
							intersect.point.y,
							intersect.point.z
						)
						console.log('Spherical', spherical, this.controls.object)

						/*this.camera.target.x =
							SPHERE_RADIUS *
							Math.sin(spherical.phi) *
							Math.cos(spherical.theta)
						this.camera.target.y = SPHERE_RADIUS * Math.cos(spherical.phi)
						this.camera.target.z =
							SPHERE_RADIUS *
							Math.sin(spherical.phi) *
							Math.sin(spherical.theta)

						this.camera.lookAt(this.camera.target)*/

						this.controls.setAzimuthalAngle(spherical.phi)
						this.controls.setPolarAngle(spherical.theta)

						setTimeout(() => {
							this.toggleTooltip('show')
							let tooltipRect = this.tooltip.getBoundingClientRect()

							let top = clientY - tooltipRect.height - 20
							let left = clientX - domRect.x - 150
							this.tooltip.style.top = `${top}px`
							this.tooltip.style.left = `${left}px`
							this.tooltip.style.opacity = 1
						}, 5)
					}
				}
			})
		},
		onSliderDragging() {
			let opacity = this.draggingValue / 100

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
				//sprite.position.copy(point.clone())
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
			this.soundManager.setVolume(this.soundVolume / 100)
		},
		udpdateVolume(value) {
			this.soundVolume += value
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
			this.draggingValue = 0
			let url = `/preview/${this.site}/immersive/${immersive.id}`
			window.history.replaceState(null, null, url)
			this.immersiveFile = immersive.file
			this.unloadImmersive()
			this.loadImmersive()
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
	padding: 0.2em;
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

.slider-container {
	display: flex;
	height: auto;
	width: 5rem;
	background: black;
	border-radius: 3px;
	opacity: 0.9;
	padding: 1em;
}

input[type='range'][orient='vertical'] {
	writing-mode: bt-lr; /* IE */
	-webkit-appearance: slider-vertical; /* WebKit */
	width: 8px;
	height: 100px;
}

input[type='range'].custom-slider {
	-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
	width: 100%; /* Specific width is required for Firefox. */
	background: transparent; /* Otherwise white in Chrome */
}

input[type='range'].custom-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
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
	border: 1px solid #000000;
	height: 26px;
	width: 10px;
	border-radius: 3px;
	background: #ffffff;
	cursor: pointer;
	margin-top: -10px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
}

/* All the same stuff for Firefox */
input[type='range'].custom-slider::-moz-range-thumb {
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	border: 1px solid #000000;
	height: 26px;
	width: 10px;
	border-radius: 3px;
	background: #ffffff;
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
	height: 5.4px;
	cursor: pointer;
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	background: white;
	border-radius: 1.3px;
	margin: 5px;
	border: 0.2px solid #010101;
}

input[type='range'].custom-slider:focus::-webkit-slider-runnable-track {
	background: white;
}

input[type='range'].custom-slider::-moz-range-track {
	width: 100%;
	height: 5.4px;
	cursor: pointer;
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	background: white;
	margin: 5px;
	border-radius: 1.3px;
	border: 0.2px solid #010101;
}

input[type='range'].custom-slider::-ms-track {
	width: 100%;
	height: 5.4px;
	cursor: pointer;
	background: transparent;
	border-color: transparent;
	border-width: 16px 0;
	margin: 5px;

	color: transparent;
}
input[type='range'].custom-slider::-ms-fill-lower {
	background: white;
	border: 0.2px solid #010101;
	border-radius: 2.6px;
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range'].custom-slider:focus::-ms-fill-lower {
	background: white;
}
input[type='range'].custom-slider::-ms-fill-upper {
	background: white;
	border: 0.2px solid #010101;
	border-radius: 2.6px;
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range'].custom-slider:focus::-ms-fill-upper {
	background: white;
}
</style>

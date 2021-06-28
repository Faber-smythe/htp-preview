<template>
  <div
    id="canvasHolder"
    ref="canvasHolder"
    :style="`
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
     `"
  >
    <canvas
      ref="renderCanvas"
      class="renderCanvas"
      @click="canvasClick"
    ></canvas>
    <!-- Custom tooltip -->
    <div id="tooltip" class="custom-tooltip">
      <span class="tooltiptext noselect"></span>
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { gsap } from 'gsap'
import * as BABYLON from 'babylonjs'
// import types
import Site from '@/types/Site'
// import Io from '@/types/Io'
import ImmersiveContent from '@/types/ImmersiveContent'
import InjectedSprite from '@/types/InjectedSprite'
// import miscellaneous
import BabylonController from '@/utils/BabylonController'

@Component
export default class ImmersiveScene extends Vue {
  @Prop({ type: Boolean, required: false }) readonly tweening!: Boolean
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ required: true }) readonly loadScreen!: HTMLElement
  @Prop({ type: Object, required: false }) readonly immersive!: ImmersiveContent
  @Prop({ type: Object, required: false }) readonly timeSlideLocation: any
  @Prop({ type: Number, required: true }) readonly autopilotRatio!: number
  @Prop({ type: Number, required: true }) readonly cursorX!: number
  @Prop({ type: Number, required: true }) readonly cursorY!: number

  spheres!: BABYLON.Mesh[] // initialized once mounted
  sphereLayerMaterials: BABYLON.StandardMaterial[] = []
  BC!: BabylonController
  camera!: BABYLON.ArcRotateCamera
  canvasUntouched: boolean = true
  treasureMesh!: BABYLON.AbstractMesh
  treasureHoverFactor: number = 1
  treasureTriggerSprite!: BABYLON.Sprite

  autopilotMin: number = 0
  autopilotMax: number = 0.95
  centerviewPadding: number = 0.075
  hotspotThreshold: number = 65 // in % of time forward slide

  mounted() {
    this.initScene()
    // Watch canvas resize event to adjust the 3D scene
    const resizeWatcher = new ResizeObserver(() => {
      this.BC.engine.resize()
    })
    resizeWatcher.observe(this.$refs.renderCanvas as HTMLElement)
  }

  @Watch('immersive')
  initScene() {
    // create a BBLjs engine
    this.BC = new BabylonController(
      this.$refs.renderCanvas as HTMLCanvasElement,
      this.loadScreen
    )
    this.BC.handleImmersiveClicks()
    this.loadScene()
  }

  loadScene() {
    const settings = this.BC.settings

    this.camera = new BABYLON.ArcRotateCamera(
      'immersiveCamera',
      -Math.PI / 2,
      Math.PI / 2,
      1,
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    this.camera.fov = settings.fov
    this.camera.inertia = settings.inertia
    this.camera.attachControl(this.$refs.renderCanvas, true)
    this.camera.angularSensibilityX /= -settings.sensitivity * 2
    this.camera.angularSensibilityY /= -settings.sensitivity * 2
    this.camera.wheelPrecision = 9999
    this.camera.panningSensibility = 9999

    // create light
    const light = new BABYLON.HemisphericLight(
      'immersiveLight',
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    light.intensity = settings.brightness

    // create a sphere
    this.initSpheres()

    // create the treasure
    // this.initTreasure()

    // create hotspots
    this.initHotSpots()

    this.BC.am.load()
    // show debug layer if asked
    if (this.BC.settings.debugLayer) this.BC.scene.debugLayer.show()

    // prepare hotspot popping
    this.initHotspotInserts()

    // Inject autopilot inbetween frames
    this.registerAutopilot()

    // rendering frames
    this.BC.engine.runRenderLoop(() => {
      // this.alphaTimeTransition() // handle visual transition over time slide
      if (this.camera.radius < 0.1) this.camera.radius = 0.1 // prevent center clipping
      // if (this.canvasUntouched) camera.alpha += 0.0005 // slow rotating idle
      this.BC.scene.render()
    })
  }

  initSpheres() {
    this.spheres = []
    this.immersive.layers.forEach((layer, i) => {
      // prepare sphere textures with BABYLON asset manager
      const path = require(`@/assets/resources3D/immersives/${this.site.siteID}/${layer.uniqueID}.jpg`)
      const task = this.BC.am.addTextureTask('task', path)
      task.onSuccess = (task) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(
          `sphereMap_${i}`,
          { diameter: this.BC.settings.sphereDiameter },
          this.BC.scene
        )
        const mat = new BABYLON.StandardMaterial(
          `material_${layer.skyboxMaterial}`,
          this.BC.scene
        )
        mat.diffuseTexture = task.texture
        // Invert textured faces for concave mesh
        mat.sideOrientation = BABYLON.Material.ClockWiseSideOrientation
        // the semicolon is to separate the above line, thus preventing a function call
        ;(mat.diffuseTexture as BABYLON.Texture).vScale = -1

        // assign the material to the mesh
        sphere.material = mat
        this.spheres[i] = sphere
      }
    })
    // Initialize layer opacity. Changes will be watched.
    this.alphaTimeTransition()
  }

  initTreasure() {
    this.treasureMesh = new BABYLON.AbstractMesh('treasure', this.BC.scene)
    const treasurePosition = this.BC.generate3DPosition(
      this.immersive.treasure.position,
      this.BC.settings.sphereDiameter / 2
    )
    treasurePosition.z *= -1
    treasurePosition.y *= -1
    /**
     * HANDLING THE CUSTOM TRIGGER
     */
    const treasureTriggerPath = require('@/assets/resources3d/textures/treasure_trigger.png')

    const sm = new BABYLON.SpriteManager(
      'treasureSpriteManager',
      treasureTriggerPath,
      2,
      55,
      this.BC.scene
    )
    sm.renderingGroupId = 3
    sm.isPickable = true
    this.treasureTriggerSprite = new BABYLON.Sprite(`treasureTriger`, sm)
    this.treasureTriggerSprite.position = treasurePosition
    const triggerSize =
      (this.BC.settings.sphereDiameter / 40) * this.BC.settings.hotspotSize * 2
    this.treasureTriggerSprite.width = triggerSize
    this.treasureTriggerSprite.height = triggerSize
    // this.treasureTriggerSprite.useAlphaForPicking = true
    this.treasureTriggerSprite.isPickable = true
    this.treasureTriggerSprite.isVisible = false
    this.BC.setTreasureHover(this.treasureTriggerSprite)
    this.BC.treasureClick = () => {
      this.$emit('found-treasure')
    }

    /**
     * HANDLING THE rotating planes
     */
    for (let i = 0; i < 4; i++) {
      const plane = BABYLON.MeshBuilder.CreatePlane(`treasurePlane${1}`, {
        height: 200,
        width: 200,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      })
      plane.setParent(this.treasureMesh)
      plane.renderingGroupId = 2
      plane.position = treasurePosition
      plane.rotation = new BABYLON.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
    }
    const path = require(`@/assets/resources3d/textures/treasure.png`)
    const task = this.BC.am.addTextureTask('treasureTask', path)
    const mat = new BABYLON.StandardMaterial('treasureMaterial', this.BC.scene)
    task.onSuccess = (task) => {
      mat.diffuseTexture = task.texture
      mat.diffuseTexture.hasAlpha = true
      mat.useAlphaFromDiffuseTexture = true
      this.treasureMesh.getChildMeshes().forEach((plane) => {
        plane.material = mat
      })
    }
    // set animation
    this.BC.scene.registerBeforeRender(() => {
      this.treasureMesh.getChildMeshes().forEach((plane) => {
        plane.rotation.x += 0.007 * this.BC.treasureHoverFactor
        plane.rotation.y += 0.007 * this.BC.treasureHoverFactor
        plane.rotation.z += 0.007 * this.BC.treasureHoverFactor
      })
    })
  }

  initHotSpots() {
    const settings = this.BC.settings

    // filter data for only useful hotspots
    this.immersive.hotspots = this.immersive.hotspots.filter(
      (hotspot) => hotspot.type === 'INSERT'
    )

    // Display the hotspots
    this.immersive.hotspots.forEach((hotspot, i) => {
      let sprite
      switch (hotspot.type) {
        case 'INSERT':
          sprite = new BABYLON.Sprite(`hotspotSprite-${i}`, this.BC.sm1)
          sprite.playAnimation(0, 22, true, 80)
          break
        // handle initialization for other types of Hotspot
      }
      sprite.isPickable = true
      sprite.position = this.BC.generate3DPosition(
        hotspot.position,
        settings.sphereDiameter / 2
      )
      // inject hotspot data into the sprite
      sprite.hotspotData = hotspot
      // Add sprite hover
      this.BC.setSpriteHover(sprite)
      // Invert the z-axis to fit coordinates
      sprite.position.z *= -1
      // Adjust sprite scale to sphere radius
      sprite.width = (settings.sphereDiameter / 40) * settings.hotspotSize
      sprite.height = (settings.sphereDiameter / 40) * settings.hotspotSize
    })
  }

  initHotspotInserts() {
    const parent = this.$refs.canvasHolder as HTMLElement
    const injectedSprites = this.BC.sm1.sprites as InjectedSprite[]
    injectedSprites.forEach((sprite) => {
      // shell
      const insert = document.createElement('div')
      insert.classList.add('insert')
      // asset
      const asset = new Image()
      const source = sprite.hotspotData.visualAsset
        ? sprite.hotspotData.visualAsset
        : 'https://f.hellowork.com/blogdumoderateur/2013/02/gif-anime.gif'
      asset.src = source
      insert.append(asset)
      // caption
      const caption = document.createElement('p')
      caption.classList.add('caption')
      caption.innerHTML = this.$t(sprite.hotspotData.value) as string
      insert.append(caption)
      // append to document
      parent.append(insert)
      // attach to the sprite object
      sprite.hotspotData.insert = insert
    })
  }

  @Watch('timeSlideLocation')
  alphaTimeTransition() {
    if (!this.spheres[0]) {
      setTimeout(() => {
        this.alphaTimeTransition()
      }, 100)
    } else {
      // Opacity transition between spheremaps along timesliding
      this.spheres.forEach((sphere, i) => {
        if (sphere.material !== null) {
          if (i === this.timeSlideLocation.index) {
            if (this.timeSlideLocation.ratioToNext <= 0.5) {
              sphere.material.alpha = 1 - this.timeSlideLocation.ratioToNext
            } else {
              sphere.material.alpha = this.timeSlideLocation.ratioToNext
            }
          } else if (
            this.timeSlideLocation.ratioToNext <= 0.5 &&
            i === this.timeSlideLocation.index + 1
          ) {
            sphere.material.alpha = this.timeSlideLocation.ratioToNext
          } else if (
            this.timeSlideLocation.ratioToNext > 0.5 &&
            i === this.timeSlideLocation.index - 1
          ) {
            sphere.material.alpha = 1 - this.timeSlideLocation.ratioToNext
          } else {
            sphere.material.alpha = 0
          }
        }
      })

      // hide "Text" hotspots on corresponding layers
      this.BC.sm1.sprites.forEach((sprite) => {
        // Cast is necessary since we injected the sprites with the hotspot
        const injectedSprite = sprite as InjectedSprite
        const size =
          (this.BC.settings.sphereDiameter / 40) * this.BC.settings.hotspotSize
        /** below for autopilot and manual threshold **/
        if (this.timeSlideLocation.value < this.hotspotThreshold) {
          injectedSprite.width = size
          injectedSprite.height = size
        } else {
          injectedSprite.width = 0
          injectedSprite.height = 0
        }
        /**  below for more than 2 layers **/
        // if (injectedSprite.hotspotData.index === this.timeSlideLocation.index) {
        //   injectedSprite.width =
        //     (this.BC.settings.sphereDiameter / 40) *
        //     this.BC.settings.hotspotSize
        //   injectedSprite.height =
        //     (this.BC.settings.sphereDiameter / 40) *
        //     this.BC.settings.hotspotSize
        // } else {
        //   injectedSprite.width = 0
        //   injectedSprite.height = 0
        // }
      })

      // hide "CloseUp" hotspots on corresponding layers
      this.BC.sm2.sprites.forEach((sprite) => {
        // Cast is necessary since we injected the sprites with the hotspot
        const injectedSprite = sprite as InjectedSprite
        if (injectedSprite.hotspotData.index === this.timeSlideLocation.index) {
          injectedSprite.width =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
          injectedSprite.height =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
        } else {
          injectedSprite.width = 0
          injectedSprite.height = 0
        }
      })

      // enable treasure only for appropriate layer
      if (this.timeSlideLocation.index !== this.immersive.treasure.layer) {
        // visible glow effect
        if (this.treasureMesh) this.treasureMesh.setEnabled(false)
        // picking trigger
        if (this.treasureTriggerSprite) {
          this.treasureTriggerSprite.isPickable = false
        }
      } else {
        // visible glow effect
        if (this.treasureMesh) this.treasureMesh.setEnabled(true)
        // picking trigger
        if (this.treasureTriggerSprite) {
          this.treasureTriggerSprite.isPickable = true
        }
      }
    }
  }

  registerAutopilot() {
    this.BC.scene.registerBeforeRender(() => {
      /**
       * CAMERA TRAVELING AND MOUSE SWAYING
       */
      // cursor positions already range from -1 to 1 for viewport limits
      const { cursorX, cursorY } = this
      const ratio = this.autopilotRatio
      let innerRatio
      // beyond ratio limits
      if (ratio <= this.autopilotMin) {
        innerRatio = 0
      } else if (ratio >= this.autopilotMax) {
        innerRatio = 1
      } else {
        const range = this.autopilotMax - this.autopilotMin
        innerRatio = (ratio - this.autopilotMin) / range
      }
      const originAngle = 3.75
      const targetAngle = 6.35
      const alphaSwayReach = Math.PI * 0.05
      const betaSwayReach = Math.PI * 0.05
      const cameraAngle = originAngle + (targetAngle - originAngle) * innerRatio
      this.camera.alpha = cameraAngle - alphaSwayReach * cursorX
      this.camera.beta = Math.PI / 2 - betaSwayReach * cursorY
      /**
       * HOTSPOT ENTERING VIEWFIELD
       */
      const sprites = this.BC.sm1.sprites as InjectedSprite[]
      // has the timeslide reached the past layer ?
      if (this.timeSlideLocation.value < this.hotspotThreshold) {
        this.onlySpritesInFront(sprites).forEach((sprite) => {
          // is the hotspot in center view ?
          if (this.isInCenterView(sprite.position)) {
            // is the insert opened yet ?
            if (!sprite.hotspotData.opened) {
              this.openHotspot(sprite)
              sprite.hotspotData.opened = true // toggle
            } else {
              // refresh the insert's position on given frame
              this.updateInsertPosition(sprite)
            }
          } else if (sprite.hotspotData.opened) {
            this.closeHotspot(sprite)
            sprite.hotspotData.opened = false // toggle
          }
        })
      } else {
        // close all inserts when leaving the past layer
        sprites.forEach((sprite) => {
          if (sprite.hotspotData.opened) {
            this.closeHotspot(sprite)
            sprite.hotspotData.opened = false // toggle
          }
        })
      }
    })
  }

  onlySpritesInFront(sprites: InjectedSprite[]): InjectedSprite[] {
    return sprites.filter((sprite) => {
      const cameraToSpriteAngle = this.BC.angleBetweenTwoVectors(
        this.camera.position,
        sprite.position
      )
      return cameraToSpriteAngle > 90
    })
  }

  isInCenterView(worldPosition: BABYLON.Vector3): Boolean {
    const screenPosition = this.BC.worldToScreenCoordinates(worldPosition)
    if (
      screenPosition.x > window.innerWidth * this.centerviewPadding &&
      screenPosition.x < window.innerWidth * (1 - this.centerviewPadding) &&
      screenPosition.y > window.innerHeight * this.centerviewPadding &&
      screenPosition.y < window.innerHeight * (1 - this.centerviewPadding)
    ) {
      return true
    } else {
      return false
    }
  }

  openHotspot(sprite: InjectedSprite) {
    // sprite.isVisible = true
    const insert = sprite.hotspotData.insert
    if (insert) {
      gsap
        .timeline()
        .to(
          insert,
          { scale: 1, opacity: 1, display: 'flex', ease: 'back' },
          0.1
        )
    } else {
      console.error('this hotspot has no insert')
    }
  }

  closeHotspot(sprite: InjectedSprite) {
    // sprite.isVisible = false
    const insert = sprite.hotspotData.insert
    if (insert) {
      gsap
        .timeline()
        .to(insert, { scale: 0.75, opacity: 0 }, 0.1)
        .to(insert, { display: 'none' }, 0.01)
    } else {
      console.error('this hotspot has no insert')
    }
  }

  updateInsertPosition(sprite: InjectedSprite) {
    const insert = sprite.hotspotData.insert
    if (insert) {
      const rec = insert.getBoundingClientRect()
      const coord2D = this.BC.worldToScreenCoordinates(sprite.position)
      insert.style.top = `${coord2D.y - rec.height - 20}px`
      insert.style.left = `${coord2D.x - rec.width / 2}px`
    } else {
      console.error('this hotspot has no insert')
    }
  }

  canvasClick() {
    this.canvasUntouched = false
  }
}
</script>

<style>
#canvasHolder {
  /* perspective: 800px; */
}
.renderCanvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
.ioCanvas {
  border: 1px solid rgb(100, 100, 100);
  border-radius: 3px;
}
.ioCanvas:focus-visible {
  outline: none;
}

/* need to cancel some unwanted buefy messing up the scene explorer */
#inspector-host,
#scene-explorer-host {
  /* position: absolute !important; */
  z-index: 999;
  height: 100%;
}
#scene-explorer-host .title,
#inspector-host .title,
#scene-explorer-host .label,
#inspector-host .label {
  font-size: inherit;
  color: inherit;
  font-style: inherit;
  font-weight: inherit;
  margin-bottom: 0px;
}

.insert {
  position: absolute;
  width: 25vh;
  padding: 0px;
  z-index: 5;
  left: 0px;
  top: 0px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  flex-direction: column;
  transform-origin: bottom;
  display: none;
  transform: scale(0.75);
  /* transition: all 0.1 s ease ; */
}
.insert::after {
  content: ' ';
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -8px;
  border-width: 8px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
.insert img {
  max-width: 25vh;
  max-height: 25vh;
  width: auto;
  height: auto;
  border-radius: 5px 5px 0px 0px;
  /* transform-origin: bottom; */
}
.insert .caption {
  padding: 5px;
  font-size: 0.65rem;
  text-align: center;
  /* transform-origin: top; */
}
.insert.opened {
  display: flex;
}
</style>

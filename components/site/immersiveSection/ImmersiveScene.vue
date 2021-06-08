<template>
  <div
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

import * as BABYLON from 'babylonjs'
// import types
import Site from '@/types/Site'
// import Io from '@/types/Io'
import ImmersiveContent, { Hotspot } from '@/types/ImmersiveContent'
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
  // @Prop({ type: Object, required: false })
  // readonly immersiveContent!: ImmersiveContent

  spheres!: BABYLON.Mesh[] // initialized once mounted
  sphereLayerMaterials: BABYLON.StandardMaterial[] = []
  BC!: BabylonController
  canvasUntouched: boolean = true
  treasureMesh!: BABYLON.AbstractMesh
  treasureHoverFactor: number = 1

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

    const camera = new BABYLON.ArcRotateCamera(
      'immersiveCamera',
      -Math.PI / 2,
      Math.PI / 2,
      1,
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    camera.fov = settings.fov
    camera.inertia = settings.inertia
    camera.attachControl(this.$refs.renderCanvas, true)
    camera.angularSensibilityX /= -settings.sensitivity * 2
    camera.angularSensibilityY /= -settings.sensitivity * 2
    camera.wheelPrecision = 9999
    camera.panningSensibility = 9999

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
    this.initTreasure()

    // create hotspots
    this.initHotSpots()

    this.BC.am.load()
    // show debug layer if asked
    if (this.BC.settings.debugLayer) this.BC.scene.debugLayer.show()

    // rendering frames
    this.BC.engine.runRenderLoop(() => {
      // this.alphaTimeTransition() // handle visual transition over time slide
      if (camera.radius < 0.1) camera.radius = 0.1 // prevent center clipping
      if (this.canvasUntouched) camera.alpha += 0.0005 // slow rotating idle
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
    const triggerSprite = new BABYLON.Sprite(`treasureTriger`, sm)
    triggerSprite.position = treasurePosition
    const triggerSize =
      (this.BC.settings.sphereDiameter / 40) * this.BC.settings.hotspotSize * 2
    triggerSprite.width = triggerSize
    triggerSprite.height = triggerSize
    // triggerSprite.useAlphaForPicking = true
    triggerSprite.isPickable = true
    triggerSprite.isVisible = false
    this.BC.setTreasureHover(triggerSprite)
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
      (hotspot) =>
        hotspot.type === 'TextHotspot' ||
        (hotspot.type === 'CloseUpHotspot' && hotspot.contentList.length === 1)
    )

    // Display the hotspots
    this.immersive.hotspots.forEach((hotspot, i) => {
      let sprite
      switch (hotspot.type) {
        case 'TextHotspot':
          sprite = new BABYLON.Sprite(`hotspotSprite-${i}`, this.BC.sm1)
          sprite.playAnimation(0, 22, true, 80)
          break
        case 'CloseUpHotspot':
          sprite = new BABYLON.Sprite(`hotspotSprite-${i}`, this.BC.sm2)
          break
      }
      sprite.isPickable = true
      sprite.position = this.BC.generate3DPosition(
        hotspot.position,
        settings.sphereDiameter / 2
      )
      // inject hotspot data into the sprite
      const data = this.getHotspotContent(hotspot)
      sprite.hotspotData = data
      // Add sprite hover
      this.BC.setSpriteHover(sprite)
      // Invert the z-axis to fit coordinates
      sprite.position.z *= -1
      // Adjust sprite scale to sphere radius
      sprite.width = (settings.sphereDiameter / 40) * settings.hotspotSize
      sprite.height = (settings.sphereDiameter / 40) * settings.hotspotSize
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
        const castSprite = sprite as InjectedSprite
        if (castSprite.hotspotData.index === this.timeSlideLocation.index) {
          castSprite.width =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
          castSprite.height =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
        } else {
          castSprite.width = 0
          castSprite.height = 0
        }
      })

      // hide "CloseUp" hotspots on corresponding layers
      this.BC.sm2.sprites.forEach((sprite) => {
        // Cast is necessary since we injected the sprites with the hotspot
        const castSprite = sprite as InjectedSprite
        if (castSprite.hotspotData.index === this.timeSlideLocation.index) {
          castSprite.width =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
          castSprite.height =
            (this.BC.settings.sphereDiameter / 40) *
            this.BC.settings.hotspotSize
        } else {
          castSprite.width = 0
          castSprite.height = 0
        }
      })

      // enable treasure only for appropriate layer
      if (this.timeSlideLocation.index !== this.immersive.treasure.layer) {
        this.treasureMesh.setEnabled(false)
      } else {
        this.treasureMesh.setEnabled(true)
      }
    }
  }

  getHotspotContent(hotspot: Hotspot) {
    const key = hotspot.contentList[0].value
    const data: any = { type: hotspot.contentList[0].type }
    data.value = data.type === 'Text' ? this.$t(key) : key
    data.index = hotspot.index
    // console.log(data)
    return data
  }

  canvasClick() {
    this.canvasUntouched = false
  }
}
</script>

<style>
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

#tooltip {
  position: absolute;
  width: 28.125rem;
  padding: 7px;
  z-index: 5;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  visibility: hidden;
}
#tooltip::after {
  content: ' ';
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
</style>

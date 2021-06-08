<template>
  <canvas ref="renderCanvas" class="renderCanvas" @click="canvasClick"></canvas>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
// import '@babylonjs/loaders/glTF'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
// import types
import Site from '@/types/Site'
import { ObjectAsset } from '@/types/VisualAsset'
// import miscellaneous
import BabylonController from '@/utils/BabylonController'

@Component
export default class VisualAssetScene extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ type: Object, required: true }) readonly object!: ObjectAsset
  @Prop({ required: true }) readonly loadScreen!: HTMLElement

  BC!: BabylonController
  meshes!: BABYLON.AbstractMesh[]
  canvasUntouched: boolean = true

  mounted() {
    this.initScene()
    // Watch canvas resize event to adjust the 3D scene
    const resizeWatcher = new ResizeObserver(() => {
      this.BC.engine.resize()
    })
    resizeWatcher.observe(this.$refs.renderCanvas as HTMLElement)
  }

  initScene() {
    // create a BBLjs engine
    this.BC = new BabylonController(
      this.$refs.renderCanvas as HTMLCanvasElement,
      this.loadScreen
    )
    this.loadScene()
  }

  async loadScene() {
    const settings = this.BC.settings

    // set the canvas background to transparent
    this.BC.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    // create the camera
    const camera = new BABYLON.ArcRotateCamera(
      'immersiveCamera',
      -Math.PI / 2,
      Math.PI / 3,
      40,
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    camera.fov = settings.fov
    camera.inertia = 0.7
    camera.attachControl(this.$refs.renderCanvas, true)
    camera.angularSensibilityX /= settings.sensitivity * 2
    camera.angularSensibilityY /= settings.sensitivity * 2
    camera.wheelPrecision = 9999
    camera.panningSensibility = 9999

    // create light
    this.BC.scene.createDefaultLight()
    const light = this.BC.scene.lights[0]
    light.intensity = 6

    // Import the 3D object
    this.meshes = await this.loadObject()
    this.hideLoadscreen()

    // Setting data.sites.json parameters
    camera.radius = this.object.initialZoom ?? camera.radius
    if (this.object.cameraClamping) {
      camera.upperBetaLimit = Math.PI / 2
      camera.lowerBetaLimit = 0
    }

    // rendering frames
    this.BC.engine.runRenderLoop(() => {
      // this.alphaTimeTransition() // handle visual transition over time slide
      if (camera.radius < 0.1) camera.radius = 0.1 // prevent center clipping
      if (this.canvasUntouched) camera.alpha += 0.001 // slow rotating idle
      this.BC.scene.render()
    })
  }

  async loadObject(): Promise<BABYLON.AbstractMesh[]> {
    const imported = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      `/visual-assets/${this.site.siteID}/`,
      this.object.file,
      this.BC.scene
    )
    // imported.meshes[0].position.y += 35
    imported.meshes.forEach((mesh) => {
      mesh.scaling = new BABYLON.Vector3(1, 1, 1)
    })
    return imported.meshes as BABYLON.AbstractMesh[]
  }

  hideLoadscreen() {
    if (this.loadScreen !== null) {
      this.loadScreen.style.display = 'none'
    } else {
      setTimeout(() => {
        this.hideLoadscreen()
      }, 100)
    }
  }

  canvasClick() {
    this.canvasUntouched = false
  }
}
</script>

<style scoped>
.renderCanvas {
  box-shadow: inset 0px 0px 15px 5px #000000;
}
</style>

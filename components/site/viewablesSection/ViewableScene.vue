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
import { ObjectAsset } from '@/types/Viewable'
// import miscellaneous
import BabylonController from '@/utils/BabylonController'

@Component
export default class ViewableScene extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ type: Object, required: true }) readonly object!: ObjectAsset
  @Prop({ required: true }) readonly loadScreen!: HTMLElement

  BC!: BabylonController
  meshes!: BABYLON.AbstractMesh[]
  animatedMeshes: BABYLON.AbstractMesh[] = []
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
    const canvas = this.$refs.renderCanvas as HTMLCanvasElement
    // create a BBLjs engine
    this.BC = new BabylonController(canvas, this.loadScreen)
    // reposition canvas if debuglayer is enabled to keep it centered
    if (this.BC.settings.debugLayer) {
      const canvas = this.$refs.renderCanvas as HTMLElement
      canvas.style.marginLeft = '-300px'
    }
    this.loadScene()
    if (this.object.cameraClamping === 'model') {
      canvas.style.boxShadow = 'inset 0px 0px 10px 5px #000000'
    }
  }

  async loadScene() {
    const settings = this.BC.settings

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
    camera.minZ = 0.2

    // create light
    this.BC.scene.createDefaultLight()
    const light = this.BC.scene.lights[0]

    // Import the 3D object
    this.animatedMeshes = await this.loadObject()
    this.hideLoadscreen()
    if (this.animatedMeshes.length > 0) {
      // TODO there is an animation to trigger here
    }

    /** Adjusting to the 3D options **/
    // is there a light parameter ?
    light.intensity = this.object.lightIntensity ?? 2
    // is there a zoom parameter ?
    camera.radius = this.object.initialZoom ?? camera.radius
    // is there a camera clamping parameter ?
    if (this.object.cameraClamping && this.object.cameraClamping !== 'free') {
      switch (this.object.cameraClamping) {
        case 'quarter':
          camera.upperBetaLimit = Math.PI / 2
          camera.lowerBetaLimit = 0
          break
        case 'model':
          camera.upperBetaLimit = Math.PI * (3 / 8)
          camera.lowerBetaLimit = 0
          break
      }
    }

    // rendering frames
    this.BC.engine.runRenderLoop(() => {
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
    const animatedMeshes: BABYLON.AbstractMesh[] = []
    imported.meshes.forEach((mesh) => {
      mesh.scaling = new BABYLON.Vector3(1, 1, 1)
      if (mesh.animations.length > 0) {
        animatedMeshes.push(mesh)
      }
      this.BC.scene.stopAllAnimations()
    })
    this.meshes = imported.meshes as BABYLON.AbstractMesh[]
    return animatedMeshes
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

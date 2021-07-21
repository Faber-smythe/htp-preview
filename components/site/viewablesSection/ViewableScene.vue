<template>
  <canvas ref="renderCanvas" class="renderCanvas" @click="canvasClick"></canvas>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
// import '@babylonjs/loaders/glTF'
import * as BABYLON from 'babylonjs'
import * as LOADERS from 'babylonjs-loaders'
import * as GUI from 'babylonjs-gui'
// import types
import Site from '@/types/Site'
import { ObjectAsset } from '@/types/Viewable'
import ModelCore from '@/types/ModelCore'
// import miscellaneous
import BabylonController from '@/utils/BabylonController'

@Component
export default class ViewableScene extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ type: Object, required: true }) readonly object!: ObjectAsset
  @Prop({ required: true }) readonly loadScreen!: HTMLElement

  BC!: BabylonController
  camera!: BABYLON.ArcRotateCamera
  meshes!: BABYLON.AbstractMesh[]
  cores: any = {}
  animations: BABYLON.AnimationGroup[] = []
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
    this.camera = new BABYLON.ArcRotateCamera(
      'immersiveCamera',
      -Math.PI / 2,
      Math.PI / 3,
      40,
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    this.camera.fov = settings.fov
    this.camera.inertia = 0.7
    this.camera.attachControl(this.$refs.renderCanvas, true)
    this.camera.angularSensibilityX /= settings.sensitivity * 2
    this.camera.angularSensibilityY /= settings.sensitivity * 2
    this.camera.wheelPrecision = 9999
    this.camera.panningSensibility = 9999
    this.camera.minZ = 0.2

    // create light
    this.BC.scene.createDefaultLight()
    const light = this.BC.scene.lights[0]

    // Import the 3D object
    this.animations = await this.loadObject()
    this.hideLoadscreen()
    if (this.animations.length > 0) {
      // Play animated in a loop
      this.animations.forEach((anim) => {
        anim.play()
        anim.loopAnimation = true
        anim.onAnimationGroupLoopObservable.add(() => {
          anim.pause()
          setTimeout(() => {
            anim.play()
          }, 2000)
        })
      })
    }

    /** Adjusting to the 3D options **/
    // is there a light parameter ?
    light.intensity = this.object.lightIntensity ?? 2
    // is there a zoom parameter ?
    this.camera.radius = this.object.initialZoom ?? this.camera.radius
    // is there a camera clamping parameter ?
    if (this.object.cameraClamping && this.object.cameraClamping !== 'free') {
      switch (this.object.cameraClamping) {
        case 'quarter':
          this.camera.upperBetaLimit = Math.PI / 2
          this.camera.lowerBetaLimit = 0
          break
        case 'model':
          this.camera.upperBetaLimit = Math.PI * (3 / 8)
          this.camera.lowerBetaLimit = 0
          break
      }
    }

    // Initialize the 3D labels
    this.initLabels()

    // rendering frames
    this.BC.engine.runRenderLoop(() => {
      if (this.camera.radius < 0.1) this.camera.radius = 0.1 // prevent center clipping
      if (this.canvasUntouched) this.camera.alpha += 0.001 // slow rotating idle
      this.BC.scene.render()
    })
  }

  async loadObject(): Promise<BABYLON.AnimationGroup[]> {
    // cancel automatic animation on import
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(
      function (plugin) {
        if (plugin.name === 'gltf') {
          const loader = plugin as LOADERS.GLTFFileLoader
          loader.animationStartMode = LOADERS.GLTFLoaderAnimationStartMode.NONE
        }
      },
      undefined,
      undefined,
      undefined,
      true
    )

    // import the actual object
    const imported = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      `/visual-assets/${this.site.siteID}/`,
      this.object.file,
      this.BC.scene
    )

    imported.transformNodes.forEach((node) => {
      node.scaling = new BABYLON.Vector3(1, 1, 1)
    })

    imported.meshes.forEach((mesh) => {
      mesh.scaling = new BABYLON.Vector3(1, 1, 1)

      // cancel the horizontal inversion
      if (mesh.name === '__root__') {
        mesh.scaling.x = -1
      }

      // populate the cores Array (targets for the labels)
      if (mesh.name.includes('core')) {
        this.cores[`${mesh.name}`] = mesh as ModelCore
      }
    })

    // cores might not arrive in the right order, they need sorting
    // this.cores = this.cores.sort((a, b) => (a.name < b.name ? -1 : 1))

    this.meshes = imported.meshes as BABYLON.AbstractMesh[]
    return imported.animationGroups
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

  initLabels() {
    // Does the 3D object have any labels ?
    if (this.object.labels.length > 0) {
      const labels = this.object.labels
      if (Object.keys(this.cores).length !== labels.length) {
        console.info(
          `Amount of 3D targets (${
            Object.keys(this.cores).length
          }) and model labels (${labels.length}) doesn't match`
        )
      }
      labels.forEach((label, i) => {
        const labelHolder = new GUI.Rectangle(
          `${this.$t(label.value) as string}-[rectangle]`
        )

        labelHolder.color = 'black'
        labelHolder.thickness = 0
        labelHolder.background = 'white'
        const guiLabelWidth = 0.15
        this.BC.GUI.addControl(labelHolder)
        labelHolder.linkWithMesh(this.cores[`${label.meshId}`])
        labelHolder.width = guiLabelWidth
        labelHolder.heightInPixels = 48
        labelHolder.linkOffsetY = -120

        const guiLabel = new GUI.TextBlock(
          `${this.$t(label.value) as string}-[text]`
        )
        guiLabel.text = this.$t(label.value) as string
        guiLabel.textWrapping = true
        // styling the text here
        guiLabel.color = 'black'
        guiLabel.fontSizeInPixels = window.innerWidth * 0.013
        labelHolder.addControl(guiLabel)

        const line = new GUI.Line(`${this.$t(label.value) as string}-[line]`)
        line.lineWidth = 3
        line.color = 'white'
        line.y2 = 24
        this.BC.GUI.addControl(line)
        line.linkWithMesh(this.cores[`${label.meshId}`])
        line.connectedControl = labelHolder

        this.cores[`${label.meshId}`].label = labelHolder
      })
    }

    this.BC.scene.registerBeforeRender(() => {
      // // Handle Z-INDEX for overlapping labels
      // const cameraPos = this.camera.position
      // // sortByDistance
      // const orderedCores = this.cores.sort((a, b) => {
      //   // compute distance to camera
      //   const aToCamera = cameraPos.subtract(a.position)
      //   const distanceA = aToCamera.length()
      //   const bToCamera = cameraPos.subtract(b.position)
      //   const distanceB = bToCamera.length()
      //   return Math.abs(distanceB) - Math.abs(distanceA)
      // })
      // // set according Z-index
      // orderedCores.forEach((core, i) => {
      //   core.label!.zIndex = i
      //   core.label!.linkWithMesh(core)
      // })
    })
  }

  playAnimated() {}

  canvasClick() {
    this.canvasUntouched = false
  }
}
</script>

<style scoped></style>

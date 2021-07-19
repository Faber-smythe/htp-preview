<template>
  <div class="benchHalf">
    <canvas
      id="benchCanvasScene"
      ref="sceneCanvas"
      class="benchCanvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
// import Vue.js stuff
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import * as BABYLON from 'babylonjs'
// import 'babylonjs-loaders'
import * as LOADERS from 'babylonjs-loaders'

@Component
export default class Scrolltests extends Vue {
  @Prop({ type: Number, required: true }) readonly ratio!: number
  finishedImport: Boolean = false
  canvas!: HTMLCanvasElement

  scene!: BABYLON.Scene
  light!: BABYLON.HemisphericLight
  camera!: BABYLON.ArcRotateCamera

  async mounted() {
    this.canvas = this.$refs.sceneCanvas as HTMLCanvasElement
    // initialize engine
    const engine = new BABYLON.Engine(this.canvas)
    engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    // initialize scene
    this.scene = new BABYLON.Scene(engine)

    // initialize camera
    this.camera = new BABYLON.ArcRotateCamera(
      'fixedcamera',
      -Math.PI / 2,
      Math.PI / 2,
      96,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    )
    this.camera.fov = 0.5
    // this.camera.attachControl(this.canvas, true)

    // initialize light
    // this.light = new BABYLON.HemisphericLight(
    //   'pointLight',
    //   new BABYLON.Vector3(-1, 1, 0),
    //   this.scene
    // )
    // this.light.intensity = 250

    /**
     * IMPORT HERE
     */
    // cancel auto loop on import
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
    const imported = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '/',
      'tablet.glb',
      this.scene
    )
    this.finishedImport = true
    const animated: BABYLON.AbstractMesh[] = []

    imported.meshes.forEach((mesh, i) => {
      mesh.scaling = new BABYLON.Vector3(1, 1, 1)
      if (mesh.animations.length > 0) {
        this.scene.animationGroups[i].pause()
        animated.push(mesh)
      }
      mesh.position = new BABYLON.Vector3(0, 0, 0)
    })
    // reverse x flip
    imported.meshes[0].scaling = new BABYLON.Vector3(-1, 1, 1)
    this.registerAutoPilot()

    this.scene.debugLayer.show()
    // this.showAxis(5, this.scene)

    // render loop
    engine.runRenderLoop(() => {
      animated.forEach((mesh) => {
        mesh.scaling.y = 1
        mesh.scaling.z = 1
      })
      this.scene.render()
    })
  }

  registerAutoPilot() {
    this.scene.registerBeforeRender(() => {
      // console.log(this.ratio)
      // console.log(this.ratio)
      // get current light from ratio
      let lightRatio = this.ratio / 0.35
      if (lightRatio > 1) lightRatio = 1
      // this.light.position.y = -(lightRatio * 10 - 5)
      // get current rotation from ratio
      let rotationRatio = (this.ratio - 0.35) / 0.65
      if (rotationRatio < 0) rotationRatio = 0
      const root = this.scene.getNodeByName('__root__') as BABYLON.AbstractMesh
      // root.rotation.y = Math.PI * 2 * rotationRatio
    })
  }

  @Watch('ratio')
  scrollWatcher() {
    this.scene.animationGroups.forEach((animation) => {
      animation.play()
      animation.goToFrame(this.ratio * animation.to)
      animation.pause()
    })
  }

  showAxis(size, scene) {
    const makeTextPlane = function (text, color, size) {
      const dynamicTexture = new BABYLON.DynamicTexture(
        'DynamicTexture',
        50,
        scene,
        true
      )
      dynamicTexture.hasAlpha = true
      dynamicTexture.drawText(
        text,
        5,
        40,
        'bold 36px Arial',
        color,
        'transparent',
        true
      )
      const plane = BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true)
      plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
      plane.material.backFaceCulling = false
      // plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
      // plane.material.diffuseTexture = dynamicTexture
      return plane
    }

    const axisX = BABYLON.Mesh.CreateLines(
      'axisX',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
      ],
      scene
    )
    axisX.color = new BABYLON.Color3(0, 0, 0)
    const xChar = makeTextPlane('X', 'red', size / 10)
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
    const axisY = BABYLON.Mesh.CreateLines(
      'axisY',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
      ],
      scene
    )
    axisY.color = new BABYLON.Color3(0, 1, 0)
    const yChar = makeTextPlane('Y', 'green', size / 10)
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
    const axisZ = BABYLON.Mesh.CreateLines(
      'axisZ',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
      ],
      scene
    )
    axisZ.color = new BABYLON.Color3(0, 0, 1)
    const zChar = makeTextPlane('Z', 'blue', size / 10)
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
  }
}
</script>

<style>
#benchCanvasScene {
  width: 95%;
  height: 95%;
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
</style>

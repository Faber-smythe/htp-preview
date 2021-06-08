<template>
  <section>
    <canvas id="renderCanvas" ref="renderCanvas"></canvas>
  </section>
</template>

<script>
// import Vue.js stuff
import { Component, Vue } from 'vue-property-decorator'

/** -- UMD PACKAGES -- **/
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
} from 'babylonjs'
import 'babylonjs-loaders'
/** -- ES6 PACKAGES -- **/
// import {
//   Engine,
//   Scene,
//   ArcRotateCamera,
//   Vector3,
//   HemisphericLight,
//   SceneLoader,
// } from '@babylonjs/core'
// import '@babylonjs/loaders/glTF'

@Component({})
export default class Index extends Vue {
  async mounted() {
    console.log(SceneLoader.GetPluginForExtension('.glb'))

    // initialize engine
    const engine = new Engine(this.$refs.renderCanvas)
    engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    // initialize scene
    const scene = new Scene(engine)

    // initialize camera
    const camera = new ArcRotateCamera(
      'immersiveCamera',
      -Math.PI / 2,
      Math.PI / 2,
      15,
      new Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(this.$refs.renderCanvas, true)

    // initialize light
    const light = new HemisphericLight(
      'immersiveLight',
      new Vector3(0, 0, 0),
      scene
    )
    light.intensity = 2

    /** =============================
     *  -------- ISSUE BELOW --------
     * ============================= */
    await SceneLoader.ImportMeshAsync('', '/', 'test.glb', scene)

    // render loop
    engine.runRenderLoop(() => {
      scene.render()
    })
  }
}
</script>

<style>
#testCanvas {
  margin-top: 10vh;
  margin-left: 10vw;
  height: 80vh;
  width: 80vw;
}
</style>

import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui'
import { Position } from '@/types/ImmersiveContent'
import BabylonCustomLoader from '@/utils/BabylonCustomLoader'

const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180

const spritePath = require('@/assets/immersives/sprite.png')

export default class BabylonController {
  canvas!: HTMLCanvasElement
  engine!: BABYLON.Engine
  scene!: BABYLON.Scene
  GUI!: GUI.AdvancedDynamicTexture
  SM!: BABYLON.SpriteManager
  AM!: BABYLON.AssetsManager

  settings = {
    sphereDiameter: 4096, //! MUST FIT THE TEXTURE AND COORDINATES DIMENSIONS !\\
    debugLayer: false, // Enable for Babylon scene explorer and inspector
    freeCam: false, // Enable for easier navigation
    fov: 1,
    hotspotSize: 1.5,
    brightness: 5,
    sensitivity: 1.7,
    inertia: 0.2,
  }

  constructor(canvas: HTMLCanvasElement, loadScreen: HTMLElement) {
    // Setting up
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.engine.loadingScreen = new BabylonCustomLoader(loadScreen)
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
    this.scene = new BABYLON.Scene(this.engine)

    // set the canvas background to transparent
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

    // Initialize Babylon sprite manager
    this.SM = new BABYLON.SpriteManager('sm', spritePath, 32, 128, this.scene)
    this.SM.renderingGroupId = 1
    this.SM.isPickable = true

    // Initialize Babylon asset manager
    this.AM = new BABYLON.AssetsManager(this.scene)

    // Initialize Babylon GUI
    this.GUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      'UI',
      true,
      this.scene
    )

    // Toggle debuglayer
    if (this.settings.debugLayer) {
      this.scene.debugLayer.show()
    }
  }

  handleImmersiveClicks(meshCallback?: Function, spriteCallback?: Function) {
    // Handle clicking events
    this.scene.onPointerDown = (event, pickResult) => {
      if (pickResult) {
        console.log('picked something :', event)
        if (pickResult.pickedMesh) {
          if (meshCallback) {
            meshCallback()
          } else {
            console.log('picked a mesh :', pickResult.pickedMesh.name)
          }
        } else if (pickResult.pickedSprite) {
          if (spriteCallback) {
            spriteCallback()
          } else {
            console.log('picked a sprite :', pickResult.pickedSprite.name)
          }
        }
      }
    }
  }

  worldToScreenCoordinates(coordinates: BABYLON.Vector3): BABYLON.Vector2 {
    const camera = this.scene.cameras[0]
    const projection = BABYLON.Vector3.Project(
      coordinates,
      BABYLON.Matrix.Identity(),
      this.scene.getTransformMatrix(),
      camera.viewport.toGlobal(
        this.canvas.clientWidth,
        this.canvas.clientHeight
      )
    )
    return new BABYLON.Vector2(projection.x, projection.y)
  }

  angleBetweenTwoVectors(vec1: BABYLON.Vector3, vec2: BABYLON.Vector3): number {
    const normalized1 = BABYLON.Vector3.Normalize(vec1)
    const normalized2 = BABYLON.Vector3.Normalize(vec2)

    const dotVec = BABYLON.Vector3.Dot(normalized2, normalized1)

    /** arcCos of dot vector **/
    const angleRadians = Math.acos(dotVec) // radians
    const angleDeegres = this.radiansToDegrees(angleRadians) // deegre

    return angleDeegres
  }

  /**
   * Return 3D cartesian coordinates for the specific hotspots into the displayed spheremap
   * @param {Hotspot} hotspot
   * @param {Number} sphereRadius
   */
  generate3DPosition(hotspotPosition: Position, sphereRadius: number) {
    /** ------------------------------------------------------------------
     * Generate polar coordinates according to 2D cartesian coordinates of the specific hotspot
     * ------------------------------------------------------------------ */

    const longitude = RAD2DEG * (hotspotPosition.x / sphereRadius)
    const latitude =
      RAD2DEG *
      (2 * Math.atan(Math.exp(hotspotPosition.y / sphereRadius)) - Math.PI / 2)

    /** ------------------------------------------------------------------
     * Generate 3D cartesian coordinates according to polar coordinates (latitude and longitude)
     * ------------------------------------------------------------------ */

    // First send the point from the origin onto the sphere's wall.
    // Then we'll rotate the vector from the origin with two angles
    const origin = new BABYLON.Vector3(0, 0, sphereRadius)

    // Converting to radians and computing the rotation on both planes
    const phi = latitude * DEG2RAD
    const theta = (270 - longitude) * DEG2RAD

    // BABYLON can't rotate a Vector3 with Euler, it needs Quaternion.
    const vecNull = BABYLON.Vector3.Zero() // Quaternion needs a reference to compute
    const quat = BABYLON.Quaternion.FromEulerAngles(phi, theta, 0) // conversion
    const cartesianCoordinates = origin.rotateByQuaternionToRef(quat, vecNull)

    return cartesianCoordinates
  }

  radiansToDegrees(radians) {
    return radians * (180 / Math.PI)
  }

  degreesToRadians(degrees) {
    return degrees / (180 / Math.PI)
  }
}

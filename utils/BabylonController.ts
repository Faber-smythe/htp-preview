import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import { Position2 } from '@/types/ImmersiveContent'
import BabylonCustomLoader from '@/utils/BabylonCustomLoader'
import { BabylonFileLoaderConfiguration } from 'babylonjs/Loading/Plugins/babylonFileLoader'

const RAD2DEG = 180 / Math.PI
const DEG2RAD = Math.PI / 180

const sprite1 = require('@/assets/resources3d/textures/hotspots/animated_sprite_test.png')
const sprite2 = require('@/assets/resources3d/textures/hotspots/Move/Off/White-2.png')

export default class BabylonController {
  canvas!: HTMLCanvasElement
  engine!: BABYLON.Engine
  scene!: BABYLON.Scene
  sm1!: BABYLON.SpriteManager
  sm2!: BABYLON.SpriteManager
  am!: BABYLON.AssetsManager
  textSprite!: BABYLON.Texture
  closeUpSprite!: BABYLON.Texture
  tooltip: HTMLElement = document.getElementById('tooltip')!
  treasureHoverFactor: number = 1
  treasureClick!: any

  settings = {
    sphereDiameter: 4096, //! MUST FIT THE TEXTURE AND COORDINATES DIMENSIONS !\\
    debugLayer: false, // Enable for Babylon scene explorer and inspector
    freeCam: false, // Enable for easier debug and navigation
    fov: 1,
    hotspotSize: 0.8,
    brightness: 6,
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
    // Initialize sprite managers
    this.sm1 = new BABYLON.SpriteManager('sm1', sprite1, 32, 90, this.scene)
    this.sm1.renderingGroupId = 1
    this.sm1.isPickable = true
    this.sm2 = new BABYLON.SpriteManager('sm2', sprite2, 8, 90, this.scene)
    this.sm2.renderingGroupId = 2
    this.sm2.isPickable = true

    // Initialize asset manager
    this.am = new BABYLON.AssetsManager(this.scene)

    this.scene.defaultCursor = 'all-scroll'
    // this.scene.defaultCursor = 'col-resize'

    // Toggle debuglayer
    if (this.settings.debugLayer) {
      this.scene.debugLayer.show()
    }
  }

  handleImmersiveClicks() {
    // Handle clicking events
    this.scene.onPointerDown = (event) => {
      const pickResult = this.scene.pickSprite(
        this.scene.pointerX,
        this.scene.pointerY
      )

      if (pickResult && pickResult.hit && pickResult.pickedSprite) {
        if (pickResult.pickedSprite.name === 'treasureTriger') {
          // treasure trigger
          this.treasureClick()
        } else {
          // standard hotspot : display the tooltip
          this.hotspotClick(pickResult.pickedSprite, {
            x: event.x,
            y: event.y,
          })
        }
      } else {
        // empty the tooltip object on clicking elsewhere
        this.emptyTooltip()
      }
    }
  }

  setTreasureHover(triggerSprite: BABYLON.Sprite) {
    triggerSprite.actionManager = new BABYLON.ActionManager(this.scene)
    // TRIGGER IN
    triggerSprite.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
          this.treasureHoverFactor = 3 // multiply animation speed
          this.scene.hoverCursor = 'pointer'
        }
      )
    )
    // TRIGGER OUT
    triggerSprite.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => {
          this.treasureHoverFactor = 1 // resume normal animation speed
        }
      )
    )
  }

  setSpriteHover(sprite: BABYLON.Sprite) {
    // TRIGGER IN
    sprite.actionManager = new BABYLON.ActionManager(this.scene)
    sprite.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        () => {
          sprite.delay = 20 // delay in ms between frames
          this.scene.hoverCursor = 'pointer'
        }
      )
    )

    // TRIGGER OUT
    sprite.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        () => {
          sprite.delay = 80 // delay in ms between frames
        }
      )
    )
  }

  hotspotClick(hotspotSprite, point) {
    // Hide previous tooltip
    this.tooltip.style.visibility = 'hidden'

    /** ----------------------------
     * Can't use state for this html injection,
     * since we need the bounding rectangle instantly,
     * and we want to avoid messing with opacity
     * --------------------------- */

    // TODO handle case : type === 'CloseUp'
    const text = this.tooltip.querySelector('.tooltiptext')!
    text.innerHTML = hotspotSprite.hotspotData.value

    // get the rendered dimensions
    const rec = this.tooltip.getBoundingClientRect()
    const canvasOffset = {
      top: this.canvas.getBoundingClientRect().top,
      left: this.canvas.getBoundingClientRect().left,
    }
    // set the correct position
    this.tooltip.style.left =
      String(point.x - rec.width / 2 - canvasOffset.left) + 'px'
    this.tooltip.style.top =
      String(
        point.y -
          rec.height -
          50 * (this.settings.hotspotSize / 2) -
          canvasOffset.top
      ) + 'px'

    this.tooltip.style.visibility = 'visible'
  }

  emptyTooltip() {
    this.tooltip.style.visibility = 'hidden'
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

    // vec.y = 0
    const normalized1 = BABYLON.Vector3.Normalize(vec1)
    const normalized2 = BABYLON.Vector3.Normalize(vec2)

    const dotVec = BABYLON.Vector3.Dot(normalized2, normalized1)

    /** arccos of dot vector **/
    const angleRadians = Math.acos(dotVec) // radians
    const angleDeegres = this.radiansToDegrees(angleRadians) // deegres

    /** To make angle from 0 to 360 (so the I quadrant != II quadrant and IV quadrant != III quadrant) **/
    // if (normalizedVec.x < 0) {
    //   angleDeegres = 360 - angleDeegres
    // }

    return angleDeegres
  }

  /**
   * Return 3D cartesian coordinates for the specific hotspots into the displayed spheremap
   * @param {Hotspot} hotspot
   * @param {Number} sphereRadius
   */
  generate3DPosition(hotspotPosition: Position2, sphereRadius: number) {
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
}

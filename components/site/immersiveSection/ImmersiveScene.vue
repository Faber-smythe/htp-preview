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
    <canvas ref="renderCanvas" class="renderCanvas"></canvas>
    <div
      v-for="(hotspot, i) in immersive.hotspots"
      :key="`hotspot-insert_${i}`"
      class="insert"
    >
      <img :src="getInsertVisualAsset(i)" :alt="$t(hotspot.alt)" />
      <p class="caption">{{ $t(hotspot.value) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { gsap } from 'gsap'
import * as BABYLON from 'babylonjs'
import * as LOADERS from 'babylonjs-loaders'
import * as GUI from 'babylonjs-gui'
// import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
import InjectedSprite from '@/types/InjectedSprite'
// import miscellaneous
import BabylonController from '@/utils/BabylonController'

@Component
export default class ImmersiveScene extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site
  @Prop({ required: true }) readonly loadScreen!: HTMLElement
  @Prop({ type: Object, required: false }) readonly immersive!: ImmersiveContent
  @Prop({ type: Object, required: false }) readonly timeSlideLocation: any
  @Prop({ type: Number, required: true }) readonly animTabletSeparator!: number
  @Prop({ type: Number, required: true }) readonly animTrailerSeparator!: number
  @Prop({ type: Number, required: true }) readonly scrollAnimRatio!: number
  @Prop({ type: Number, required: true }) readonly cursorX!: number
  @Prop({ type: Number, required: true }) readonly cursorY!: number

  /** 3D objects properties (for reference) **/
  BC!: BabylonController // contains canvas, engine, scene, GUI and more
  spheres!: BABYLON.Mesh[] // initialized once mounted
  sphereLayerMaterials: BABYLON.StandardMaterial[] = []
  camera!: BABYLON.ArcRotateCamera
  tabletMeshes: BABYLON.AbstractMesh[] = []
  tabletAnimationGroups: BABYLON.AbstractMesh[] = []

  /** settings properties **/
  autopilotStart: number = this.animTrailerSeparator * 0.98 // fraction of total scrollAnimRatio
  autopilotEnd: number = 0.98 // fraction of total scrollAnimRatio
  centerviewPadding: number = 0.1 // ratio of viewport height and width
  hotspotThreshold: number = 65 // in % of horizontal traveling
  horizontalTravelingOrigin: number = 3.75 // in radians
  horizontalTravelingTarget: number = 6.35 // in radians
  verticalSwayReach: number = Math.PI * 0.05 // in radians
  horizontalSwayReach: number = Math.PI * 0.05 // in radians

  /**  state properties **/
  cameraHorizontalAngle: number = this.horizontalTravelingOrigin // in radians
  readyTabletImport: Boolean = false

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
    if (this.BC.settings.debugLayer) this.BC.handleImmersiveClicks()
    this.loadScene()
  }

  async loadScene() {
    const settings = this.BC.settings

    this.camera = new BABYLON.ArcRotateCamera(
      'immersiveCamera',
      0,
      0,
      0,
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    this.camera.inertia = settings.inertia
    this.camera.fov = settings.fov

    // create light
    const light = new BABYLON.HemisphericLight(
      'immersiveLight',
      new BABYLON.Vector3(0, 0, 0),
      this.BC.scene
    )
    light.intensity = settings.brightness

    // load the tablet and the spheres (mesh and textures)
    await this.initTablet()
    await this.initSpheres()
    // execute the asset manager's tasks
    this.BC.AM.load()

    // load the hotspots
    this.initHotSpots()

    // prepare hotspot popping
    // this.associateInsertsToHotspots()
    this.initGuiInserts()

    // Register frame scaled updates
    this.BC.scene.registerBeforeRender(() => {
      this.onEachFrame()
    })

    // Start rendering frames
    this.BC.scene.animationTimeScale = 1
    this.BC.engine.runRenderLoop(() => {
      this.BC.scene.render()
    })
  }

  async initTablet() {
    // settings adjustments
    this.camera.fov = 0.5
    this.camera.radius = 96

    /** =====================
     * ==== IMPORT HERE ====
     * ===================== */
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
    const imported = await BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '/',
      'tablet.glb',
      this.BC.scene
    )
    this.readyTabletImport = true

    // below handling the imported objects
    imported.meshes.forEach((mesh, i) => {
      // save them in components properties for later reference
      this.tabletMeshes.push(mesh)
      // cleaning up the import junk | might need adjusting
      mesh.scaling = new BABYLON.Vector3(1, 1, 1)
      mesh.position = new BABYLON.Vector3(0, 0, 0)
      // gathering the animated objects of the import for later reference
      if (mesh.animations.length > 0) {
        this.BC.scene.animationGroups[i].pause()
        this.tabletAnimationGroups.push(mesh)
      }
    })
    // apply correspond texture on the right layers
    for (let i = 1; i <= 3; i++) {
      const path = require(`@/assets/immersives/${this.site.siteID}/screens/screen_${i}.jpg`)
      const task = this.BC.AM.addTextureTask(`screentexture_${i}`, path)
      task.onSuccess = (task) => {
        const screen = this.BC.scene.getMeshByName(`screen${i}`)
        if (screen) {
          const mat = new BABYLON.StandardMaterial(
            `screen-texture_${i}`,
            this.BC.scene
          )
          const texture = task.texture as BABYLON.Texture
          texture.vScale = -1 // clean up import junk
          texture.uScale = -1 // clean up import junk

          mat.diffuseTexture = texture
          mat.specularColor = new BABYLON.Color3(0, 0, 0)
          screen.material = mat
        } else {
          console.error('no screen found')
        }
      }
    }

    // adjust brightness
    imported.lights[0].intensity = 20000
    // reverse x flip
    imported.meshes[0].scaling = new BABYLON.Vector3(-1, 1, 1)
  }

  initSpheres() {
    this.spheres = []
    this.immersive.layers.forEach((layer, i) => {
      const path = require(`@/assets/immersives/${this.site.siteID}/${layer.uniqueID}.jpg`)
      const task = this.BC.AM.addTextureTask(`spheremaptexture_${i}`, path)
      task.onSuccess = (task) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(
          `sphereMap_${i}`,
          { diameter: this.BC.settings.sphereDiameter },
          this.BC.scene
        )
        const mat = new BABYLON.StandardMaterial(
          `material_${layer.uniqueID}`,
          this.BC.scene
        )

        const texture = task.texture as BABYLON.Texture
        texture.vScale = -1 // clean up import junk

        mat.diffuseTexture = texture
        // Invert textured faces for concave mesh
        mat.sideOrientation = BABYLON.Material.ClockWiseSideOrientation

        // set spheres as transparent at launch, tablet animation will play first, changes will be watched
        mat.alpha = 0

        // assign the material to the mesh
        sphere.material = mat
        this.spheres[i] = sphere
      }
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
      const sprite = new BABYLON.Sprite(
        `hotspotSprite-${i}`,
        this.BC.SM
      ) as InjectedSprite
      // Current animation has 45 frames
      sprite.playAnimation(0, 45, true, 0)
      /** Different kind of hotspots ? **/
      // switch (hotspot.type) {
      //   case 'INSERT':
      //     break
      //   // handle initialization for other types of Hotspot
      // }
      sprite.isPickable = true
      sprite.position = this.BC.generate3DPosition(
        hotspot.position,
        settings.sphereDiameter / 2
      )
      // Inject hotspot data into the sprite
      sprite.hotspotData = hotspot
      // Invert the z-axis to fit coordinates
      sprite.position.z *= -1
      // Initialize as transparent. Tablet animation will play first.
      // Size will be set on scroll, scaling with sphereDiameter
      sprite.width = 0
      sprite.height = 0
    })
  }

  associateInsertsToHotspots() {
    const injectedSprites = this.BC.SM.sprites as InjectedSprite[]
    Array.from(document.querySelectorAll('.insert')).forEach((insert, i) => {
      injectedSprites[i].hotspotData.insert = insert as HTMLElement
    })
  }

  getInsertVisualAsset(index): string {
    if (this.immersive.hotspots[index].visualAsset) {
      const src = require(`@/assets/immersives/${this.site.siteID}/encarts/${this.immersive.hotspots[index].visualAsset}`)
      return src
    } else {
      return 'https://f.hellowork.com/blogdumoderateur/2013/02/gif-anime.gif'
    }
  }

  initGuiInserts() {
    const spriteCoreHolder = new BABYLON.AbstractMesh(
      'spriteCoreHolder',
      this.BC.scene
    )

    const injectedSprites = this.BC.SM.sprites as InjectedSprite[]
    const backupSource =
      'https://f.hellowork.com/blogdumoderateur/2013/02/gif-anime.gif'

    injectedSprites.forEach((sprite, i) => {
      // create invisible mesh for each sprite
      // GUI elements can't be linked to sprites
      const core = BABYLON.MeshBuilder.CreateSphere(
        `spriteCore${1}`,
        { diameter: 1 },
        this.BC.scene
      )
      core.parent = spriteCoreHolder
      core.position = sprite.position

      // createt the UI insert
      const insert = new GUI.Rectangle()

      // insert.cornerRadius = 5
      insert.color = 'rgba(1, 1, 1, 0.5)'
      insert.thickness = 1
      insert.background = 'rgba(0, 0, 0, 0.55)'
      const insertWidth = 0.15
      this.BC.GUI.addControl(insert)
      insert.linkWithMesh(core)
      insert.width = insertWidth

      insert.shadowOffsetX = 15
      insert.shadowOffsetY = -15
      insert.shadowBlur = 12
      insert.shadowColor = 'rgba(0, 0, 0, 0.7)'

      const caption = new GUI.TextBlock()
      caption.text = this.$t(sprite.hotspotData.value) as string
      caption.textWrapping = true
      // styling the text here
      caption.color = 'white'
      caption.paddingLeft = caption.paddingRight = '5px'
      caption.paddingTop = caption.paddingBottom = '3px'
      caption.fontSizeInPixels = window.innerWidth * 0.012

      insert.addControl(caption)

      insert.height = insertWidth * (caption.text.length / 140)

      const captionStringHeight = insert.height as unknown as string
      const captionOffset =
        ((captionStringHeight.substring(
          0,
          captionStringHeight.length - 1
        ) as unknown as number) /
          2 /
          100) *
        window.innerHeight *
        1.3
      insert.linkOffsetY = -captionOffset - 40

      // visual asset
      let source
      if (this.immersive.hotspots[i].visualAsset) {
        source = new Image()
        source = require(`@/assets/immersives/${this.site.siteID}/encarts/${this.immersive.hotspots[i].visualAsset}`)
      } else {
        source = backupSource
      }

      const image = new GUI.Image(`visualAsset-${i}`, source)
      this.BC.GUI.addControl(image)
      image.width = insertWidth
      image.stretch = GUI.Image.STRETCH_UNIFORM
      image.linkWithMesh(core)

      image.shadowOffsetX = 15
      image.shadowOffsetY = -15
      image.shadowBlur = 15
      image.shadowColor = 'rgba(0, 0, 0, 0.5)'

      image.onImageLoadedObservable.add(() => {
        const originalHeight = image.domImage.naturalHeight
        const originalWidth = image.domImage.naturalWidth

        const imageRatio = originalWidth / originalHeight
        const imagePixelHeight = image.widthInPixels / imageRatio

        image.linkOffsetY = -captionOffset * 2 - imagePixelHeight / 2 - 40
      })
    })
  }

  onEachFrame() {
    /**
     * MOUSE SWAYING
     */
    // cursor positions already range from -1 to 1 for viewport limits
    const { cursorX, cursorY } = this

    // only during the babylon section
    if (this.scrollAnimRatio > 0.01 && this.scrollAnimRatio < 9.9) {
      if (this.scrollAnimRatio > this.animTabletSeparator) {
        // inside the immersive (second half) the horizontal traveling must be taken in account
        this.camera.alpha =
          this.cameraHorizontalAngle - this.horizontalSwayReach * cursorX
        this.camera.beta = Math.PI / 2 - this.verticalSwayReach * cursorY
      } else {
        this.camera.alpha = -Math.PI / 2 - this.horizontalSwayReach * cursorX
        this.camera.beta = Math.PI / 2 - this.verticalSwayReach * cursorY
      }
    } else {
      this.camera.alpha = -Math.PI / 2
      this.camera.beta = Math.PI / 2
    }

    /**
     * HANDLING HOTSPOT IN VIEWFIELD
     */
    const sprites = this.BC.SM.sprites as InjectedSprite[]
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
    /**
     * Import corrections
     */
    this.tabletAnimationGroups.forEach((mesh) => {
      mesh.scaling.x = Math.abs(mesh.scaling.x)
      mesh.scaling.y = 1
      mesh.scaling.z = 1
    })
  }

  @Watch('scrollAnimRatio')
  autopilotUpdate() {
    const ratio = this.scrollAnimRatio

    /** =======================
     * === TABLET ANIMATION ===
     * ===================== **/
    // Tablet animation progress ratio
    let tabletAnimRatio = 0
    if (ratio >= this.animTabletSeparator) {
      tabletAnimRatio = 1
    } else {
      const range = this.animTabletSeparator
      tabletAnimRatio = ratio / range
    }
    // Tablet fade out towards animation's end
    let tabletFadeRatio = 0
    const fadeStartRatio = 0.9
    // beyond ratio limits
    if (tabletAnimRatio >= 1) {
      tabletFadeRatio = 1
    } else if (tabletAnimRatio <= fadeStartRatio) {
      tabletFadeRatio = 0
      // Screens need to be visible now
      this.tabletMeshes.forEach((mesh) => {
        if (mesh.name.includes('screen')) {
          mesh.visibility = 1
        }
      })
    } else {
      const range = 1 - fadeStartRatio
      tabletFadeRatio = (tabletAnimRatio - fadeStartRatio) / range
      // Screens needs to be hidden now
      this.tabletMeshes.forEach((mesh) => {
        if (mesh.name.includes('screen')) {
          mesh.visibility = 0
        }
      })
    }
    // set tablet fade out
    this.tabletMeshes.forEach((mesh) => {
      if (!mesh.name.includes('screen')) {
        mesh.visibility = 1 - tabletFadeRatio
      }
    })

    // set the current frame following current scroll ratio
    this.BC.scene.animationGroups.forEach((animation) => {
      animation.play()
      animation.goToFrame(tabletAnimRatio * animation.to)
      animation.pause()
    })

    // TODO BELOW FOR MOBILE
    // const tabletHolder = this.BC.scene.getNodeByName(
    //   'Tablette'
    // ) as BABYLON.TransformNode
    // tabletHolder.position.x = 0

    /**
     *  handle threshold between tablet and autopilot
     */
    if (ratio > this.animTabletSeparator) {
      // adjust settingss
      this.camera.fov = this.BC.settings.fov
      this.camera.radius = 1
      // set spheres timeslide state
      this.alphaTimeTransition()
    } else {
      // adjust settingss
      this.camera.fov = 0.5
      this.camera.radius = 96
      // set spheres timeslide state
      // hide remaning sphere
      this.alphaTimeTransition()
      this.spheres.forEach((sphere) => {
        sphere.material!.alpha = 0
      })
    }

    /** ==========================
     * === AUTOPILOT ANIMATION ===
     * ======================== **/
    let autopilotInnerRatio
    // beyond ratio limits
    if (ratio <= this.autopilotStart) {
      autopilotInnerRatio = 0
    } else if (ratio >= this.autopilotEnd) {
      autopilotInnerRatio = 1
    } else {
      const range = this.autopilotEnd - this.autopilotStart
      autopilotInnerRatio = (ratio - this.autopilotStart) / range
    }
    // computing the horizontal traveling angle, which is then gonna be used in onEachFrame()
    const origin = this.horizontalTravelingOrigin
    const target = this.horizontalTravelingTarget
    this.cameraHorizontalAngle =
      origin + (target - origin) * autopilotInnerRatio
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
    const insert = sprite.hotspotData.insert
    if (insert) {
      gsap
        .timeline()
        .to(
          insert,
          { scale: 1, opacity: 1, display: 'flex', ease: 'back' },
          0.1
        )
      sprite.stopAnimation()
    } else {
      // console.error('this hotspot has no insert')
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
      sprite.playAnimation(0, 45, true, 0)
    } else {
      // console.error('this hotspot has no insert')
    }
  }

  updateInsertPosition(sprite: InjectedSprite) {
    const insert = sprite.hotspotData.insert
    if (insert) {
      const rec = insert.getBoundingClientRect()
      const coord2D = this.BC.worldToScreenCoordinates(sprite.position)
      if (this.BC.settings.debugLayer) {
        // if inspector panels are enabled, positions must be adjusted
        insert.style.top = `${coord2D.y - rec.height - 20}px`
        insert.style.left = `${coord2D.x - rec.width / 2 + 300}px`
      } else {
        insert.style.top = `${coord2D.y - rec.height - 20}px`
        insert.style.left = `${coord2D.x - rec.width / 2}px`
      }
    } else {
      // console.error('this hotspot has no insert')
    }
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

      // hide hotspots on corresponding layer
      this.BC.SM.sprites.forEach((sprite) => {
        // Cast is necessary since we injected each sprite with the hotspot's information
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
      })
    }
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
  /* overflow-y: scroll; */
}
#inspector-host #actionTabs .tabs {
  /* overflow-y: scroll; */
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
  box-shadow: 15px -13px 20px 5px rgba(0, 0, 0, 0.39);
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

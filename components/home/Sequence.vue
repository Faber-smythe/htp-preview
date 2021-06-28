<template>
  <div ref="benchHalf" class="benchHalf">
    <canvas
      id="benchCanvasSequence"
      ref="benchCanvas"
      class="benchCanvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
// import Vue.js stuff
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Sequence extends Vue {
  @Prop({ type: Number, required: true }) readonly ratio!: number
  @Prop({ type: String, required: true }) readonly method!: string

  frames: HTMLImageElement[] = []
  framePaths: string[] = []
  frameCount = 100
  frame: HTMLImageElement = new Image()
  available: boolean = false
  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  canvasHeight!: number
  canvasWidth!: number

  preblurCanvas: HTMLCanvasElement = document.createElement('canvas')
  preblurCtx: CanvasRenderingContext2D = this.preblurCanvas.getContext('2d')!

  created() {
    this.preloadImages()
    // const path = require(`@/assets/img/benchmarkHD/0050.png`)
    // const img = new Image()
    // img.src = path
    // this.frames.push(img)
  }

  preloadImages() {
    for (let i = 0; i <= this.frameCount; i++) {
      // const path = require(`@/assets/img/benchmark/${i
      const path = require(`@/assets/img/benchmark/${i
        .toString()
        .padStart(4, '0')}.png`)
      this.framePaths.push(path)
      const img = new Image()
      img.src = path
      this.frames.push(img)
    }
  }

  @Watch('ratio')
  canvasWatch() {
    if (this.available) {
      // find appropriate frame
      const frameIndex = Math.min(
        this.frameCount - 1,
        Math.ceil(this.ratio * this.frameCount)
      )

      // render appropriate frame
      requestAnimationFrame(() => {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        if (this.method === 'canvas') {
          /** RAW (aliased) **/
          this.context.drawImage(
            this.frames[frameIndex],
            0,
            0,
            this.canvasWidth,
            this.canvasHeight
          )
        } else if (this.method === 'css') {
          /** BACKGROUND DRAW (no aliasing)**/
          this.canvas.style.backgroundImage = `url(${this.framePaths[frameIndex]})`
        }

        /** SCALED (less aliased) **/
        // this.drawScaled(this.frames[frameIndex])
      })
    }
  }

  drawScaled(frame) {
    console.log(frame.height, frame.width)
    // step 1 - create offscreen canvas
    const oc1 = document.createElement('canvas')
    const octx1 = oc1.getContext('2d')!

    oc1.width = frame.width * 0.5
    oc1.height = frame.height * 0.5
    octx1.drawImage(frame, 0, 0, oc1.width, oc1.height)

    const oc2 = document.createElement('canvas')
    const octx2 = oc2.getContext('2d')!

    oc2.width = frame.width * 0.5
    oc2.height = frame.height * 0.5

    // step 2
    octx2.drawImage(oc1, 0, 0, oc2.width, oc2.height)
    octx1.clearRect(0, 0, oc1.width, oc1.height)
    octx1.drawImage(oc2, 0, 0, oc1.width * 0.5, oc1.height * 0.5)
    // temp = oc
    // octx.clearRect(0, 0, oc.width, oc.height)
    // octx.drawImage(temp, 0, 0, oc.width * 0.5, oc.height * 0.5)

    // step 3
    this.context.drawImage(
      oc1,
      0,
      0,
      oc1.width * 0.5,
      oc1.height * 0.5,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  mounted() {
    // declaring
    const half = this.$refs.benchHalf as HTMLElement

    // initialize the preblur canvas (for anti-aliasing)
    this.preblurCanvas.height = 3840
    this.preblurCanvas.width = 2160

    // set the canvas dimensions according to the 3D tablet dimensions
    const aspectRatio = 1920 / 1080
    if (half.clientWidth / half.clientHeight > aspectRatio) {
      this.canvasHeight = half.clientHeight * 0.95
      this.canvasWidth = this.canvasHeight * aspectRatio
    } else {
      this.canvasWidth = half.clientWidth * 0.95
      this.canvasHeight = this.canvasWidth / aspectRatio
    }

    // set the canvas and its context for easier reference
    this.canvas = this.$refs.benchCanvas as HTMLCanvasElement
    this.context = this.canvas.getContext('2d')!

    // load the first frame
    this.frames[100].onload = () => {
      this.canvas.height = this.canvasHeight
      this.canvas.width = this.canvasWidth

      this.drawScaled(this.frames[0])

      this.available = true
    }
  }
}
</script>

<style scoped>
#benchCanvasSequence {
  background: #33334c;
  background-size: contain;
  background-position: center;
}
</style>

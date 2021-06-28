<template>
  <section id="folioscopeSection" ref="folioscopeSection">
    <div class="fade-black-top"></div>
    <canvas id="folioscopeCanvas" ref="folioscopeCanvas"></canvas>
    <div id="trailerBrand">
      <h2>
        <span>H</span>
        <span>I</span>
        <span>S</span>
        <span>T</span>
        <div id="trailerLogoHolder">
          <img id="logo" ref="trailerLogo" :src="logoSrc" alt="O" />
        </div>
        <span>P</span>
        <span>A</span>
        <span>D</span>
      </h2>
    </div>

    <div id="trailerline">
      <h2>{{ $t('Trailerline') }}</h2>
    </div>
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Prop, Vue } from 'vue-property-decorator'
// import types
import Site from '@/types/Site'
import Scrollbar from 'smooth-scrollbar'
// miscellaneous
import SC from '@/utils/ScrollController'

@Component
export default class AnimatedHistopad extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site

  logoSrc = require('@/assets/img/trailerLogo.png')
  frames: HTMLImageElement[] = []
  frameCount = 90
  framePath = ''
  frame: HTMLImageElement = new Image()
  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  canvasHeight!: number
  canvasWidth!: number
  scrollDuration: number = window.innerHeight * 3
  scrollbar!: Scrollbar
  offsetTop: number = window.innerHeight
  fadePortion: number = 0.2

  created() {
    this.preloadImages()
  }

  preloadImages() {
    for (let i = 0; i <= this.frameCount; i++) {
      const path = require(`@/assets/img/sites/${this.site.linkLabel}/test/${i
        .toString()
        .padStart(4, '0')}.png`)
      const img = new Image()
      img.src = path
      this.frames.push(img)
    }
  }

  canvasInit() {
    // load the first frame
    this.frames[this.frameCount].onload = () => {
      this.canvas.height = this.canvasHeight
      this.canvas.width = this.canvasWidth
      this.context.drawImage(
        this.frames[0],
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      )
    }

    // set up animation relative to scrollable section
    this.scrollbar.addListener(() => {
      // only fire if inside the folioscope section
      if (
        this.scrollbar.scrollTop > this.offsetTop &&
        this.scrollbar.scrollTop < this.offsetTop + this.scrollDuration
      ) {
        // get the scroll location
        const scrollTop = this.scrollbar.scrollTop - this.offsetTop
        // const maxScrollTop = this.scrollDuration - window.innerHeight / 2
        const maxScrollTop = this.scrollDuration
        // get the fraction
        const scrollFraction = scrollTop / maxScrollTop
        // find appropriate frame
        const frameIndex = Math.min(
          this.frameCount - 1,
          Math.ceil(scrollFraction * this.frameCount)
        )

        // handle opacity in the last this.fadePortion of the sequence
        if (
          this.scrollbar.scrollTop >
            this.offsetTop + this.scrollDuration * 0.8 &&
          this.scrollbar.scrollTop < this.offsetTop + this.scrollDuration
        ) {
          // get current scroll location
          const current =
            this.scrollbar.scrollTop -
            this.offsetTop -
            this.scrollDuration * (1 - this.fadePortion)
          // get ratio
          const ratio = current / (this.scrollDuration * this.fadePortion)
          // apply appropriate opacity
          const section = this.$refs.folioscopeCanvas as HTMLElement
          section.style.opacity = (1 - ratio).toString()
        }

        // render appropriate frame
        requestAnimationFrame(() => {
          this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
          this.context.drawImage(
            this.frames[frameIndex],
            0,
            0,
            this.canvasWidth,
            this.canvasHeight
          )
        })
      }
    })
  }

  mounted() {
    // initialize the scrollanimated section
    this.scrollbar = SC.initFolioscopeScroller(this.scrollDuration)

    // set the canvas dimensions according to the 3D tablet dimensions
    const aspectRatio = 1115 / 630
    if (window.innerWidth / window.innerHeight < aspectRatio) {
      this.canvasHeight = window.innerHeight
      this.canvasWidth = window.innerHeight * aspectRatio
    } else {
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerWidth / aspectRatio
    }

    // set the canvas and its context for easier reference
    this.canvas = document.getElementById(
      'folioscopeCanvas'
    )! as HTMLCanvasElement
    this.context = this.canvas.getContext('2d')!
    // initialize canvas frame sequence
    this.canvasInit()
  }
}
</script>

<style scoped>
#folioscopeSection {
  position: relative;
  z-index: 5;
  height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-bottom: 2px solid blue; */
}

#trailerBrand {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50vh !important;
  left: 50vw !important;
  pointer-events: none;
  /* border: 1px solid red; */
}
#trailerBrand h2 {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
#trailerBrand span {
  font-size: 7rem;
  display: flex;
  align-items: center;
  margin: 10px;
}
#trailerLogoHolder {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 7rem;
  width: 7rem;
}
#trailerBrand img {
  position: absolute;
  height: 100%;
  width: 100%;
  animation: spin 3s linear infinite;
  transform-origin: center;
}

#trailerline {
  position: fixed;
  z-index: 100;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50vh !important;
  left: 50vw !important;
  pointer-events: none;
}
#trailerline h2 {
  text-align: center;
  position: absolute;
  width: 99vw;
  font-size: 7rem;
  text-transform: uppercase;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>

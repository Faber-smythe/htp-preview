<template>
  <section id="immersive-section">
    <ImmersiveHUD
      :site="site"
      :immersive="immersive"
      :title="immersiveTitle"
      :loading="loading"
      :slider-tooltips-labels="sliderTooltipsLabels"
      :time-slide-percent="timeSlidePercent"
      @time-slide="timeSlide($event)"
    />
    <div id="immersive-stage" ref="immersiveStage">
      <ImmersiveScene
        v-if="loadScreen"
        :site="site"
        :immersive="immersive"
        :time-slide-location="timeSlideLocation"
        :load-screen="loadScreen"
        :anim-tablet-separator="scrollAnimSeparators.tabletEnd"
        :anim-trailer-separator="scrollAnimSeparators.trailerLineEnd"
        :scroll-anim-ratio="scrollAnimRatio"
        :cursor-x="cursorX"
        :cursor-y="cursorY"
      />
      <!-- this Custom Loadscreen is handled in @utils/BabylonCustomLoader.ts -->
      <LoadingScreen @found-load-screen="(e) => setLoadScreen(e)" />
    </div>
    <h2 id="trailerLine">
      <span id="diveInto">dive into</span>&nbsp;
      <span id="thePast">the past</span>
    </h2>
    <p id="screenText_1" class="screenText">
      Curabitur sodales vehicula vehicula. Duis quis ipsum aliquam ipsum viverra
      imperdiet et vitae tellus. Quisque efficitur quam ultricies laoreet
      tristique. Integer quis ex dolor.
    </p>
    <p id="screenText_2" class="screenText">
      Duis quam ipsum, cursus at ligula tristique, suscipit volutpat dolor.
      Aenean hendrerit molestie euismod. Nullam at faucibus metus, vitae
      placerat risus.
    </p>
    <p id="screenText_3" class="screenText">
      Aliquam erat volutpat. Maecenas tempor, justo sed pharetra mattis, ligula
      risus sagittis elit, ac sodales lorem lorem eget orci. Aliquam id
      sollicitudin tortor.
    </p>
    <div id="frame"></div>
  </section>
</template>

<script lang="ts">
// Import libs
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
// Import components
import ImmersiveHUD from '@/components/site/immersiveSection/ImmersiveHUD.vue'
import ImmersiveScene from '@/components/site/immersiveSection/ImmersiveScene.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
// Import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
import Scrollbar from 'smooth-scrollbar'
// Miscellaneous
import { UtilMixins } from '@/utils/mixins'
import SC from '@/utils/ScrollController'

@Component({
  layout: 'immersive',
  components: {
    ImmersiveHUD,
    ImmersiveScene,
    LoadingScreen,
  },
})
export default class ImmersiveSection extends Mixins(UtilMixins) {
  @Prop({ type: Object, required: true }) readonly immersive!: ImmersiveContent
  @Prop({ type: Object, required: true }) readonly site!: Site

  /** REFERENCE PROPERTIES **/
  loadScreen = null
  swayedTitles: HTMLElement[] = []
  swayedScreenTexts: HTMLElement[] = []

  /** SETTINGS PROPERTIES **/
  // total duration of the 3D scroll animation (in scrolled pixels )
  scrollAnimDuration: number = window.innerHeight * 14
  // shouldn't need editing, it fits HeaderSection's height
  scrollAnimOffsetTop: number = window.innerHeight
  scrollAnimSeparators = {
    // ratio of the total duration deciding the end of to the tablet animation
    tabletEnd: 0.65,
    // ratio of the total duration deciding the end of the trailerLine animation
    trailerLineEnd: 0.75,
  }

  /** below are the manual magnets :
   * they hold the location relative to the tablet animation where scroll should snap
   * to find them, stop on desired frame, go to the AnimationGroup inspector and divide the "To" property by the current frame
   */
  tabletMagnets: number[] = [0.254, 0.409, 0.691]

  /** STATE PROPERTIES **/
  loading: boolean = false
  onScrollingStop!: ReturnType<typeof setTimeout>
  timeSlidePercent: number = 100
  scrollAnimRatio: number = 0
  // autoslide ratios below decide when the time slide should start listening to the scroll
  autoSlideMin: number = this.scrollAnimSeparators.trailerLineEnd * 1.05
  autoSlideMax: number = 0.9
  // cursor position is [0;0] on viewport center, positive x goes down and positive y goes right
  // used for 3D swaying across the page
  cursorX: number = 0
  cursorY: number = 0
  wheelVelocity: number = 0

  get sliderTooltipsLabels() {
    return this.immersive.layers.map((layer) => this.$t(layer.periodLabel))
  }

  get immersiveTitle() {
    return (
      this.immersive &&
      this.timeSlideLocation &&
      this.$t(this.immersive.layers[this.timeSlideLocation.index].periodTitle)
    )
  }

  get timeSlideLocation() {
    if (this.immersive) {
      const amount = this.immersive.layers.length
      const range = 100 / (amount - 1)
      const location = {
        value: this.timeSlidePercent,
        index: -1, // negative means it hasn't yet been found
        ratioToNext: 0,
      }

      // list slide distance to every time layer
      const proximityToLayer: number[] = []
      for (let i = 0; i < amount; i++) {
        proximityToLayer.push(Math.abs(location.value - (0 + range * i)))
      }
      // find the close time layer
      location.index = 0
      for (let u = 1; u < proximityToLayer.length; u++) {
        if (proximityToLayer[u] < proximityToLayer[location.index])
          location.index = u
      }
      // compute relative opacity ratio
      location.ratioToNext = (location.value % range) / range
      if (location.index < 0) location.index = 0
      return location
    } else {
      return null
    }
  }

  get scrollMagnets() {
    const { tabletEnd, trailerLineEnd } = this.scrollAnimSeparators
    const magnets = {
      top: 0,
      screen1:
        this.scrollAnimOffsetTop +
        this.scrollAnimDuration * tabletEnd * this.tabletMagnets[0],
      screen2:
        this.scrollAnimOffsetTop +
        this.scrollAnimDuration * tabletEnd * this.tabletMagnets[1],
      screen3:
        this.scrollAnimOffsetTop +
        this.scrollAnimDuration * tabletEnd * this.tabletMagnets[2],
      trailerLine:
        this.scrollAnimOffsetTop +
        this.scrollAnimDuration * tabletEnd +
        (this.scrollAnimDuration * trailerLineEnd -
          this.scrollAnimDuration * tabletEnd) /
          2,
      immersiveStart:
        this.scrollAnimOffsetTop + this.scrollAnimDuration * trailerLineEnd,
    }
    return magnets
  }

  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.initText3DSwaying()
      this.initScrollAttempt()
      this.watchCursorPosition()
    })
  }

  watchCursorPosition() {
    // const stage = this.$refs.immersiveStage as HTMLElement
    document.body.addEventListener('mousemove', (e) => {
      // console.log('x : ', e.clientX, '|| y : ', e.clientY)
      this.cursorX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      this.cursorY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
    })
  }

  initText3DSwaying() {
    this.swayedTitles.push(
      document.querySelector('#header-section h1') as HTMLElement
    )
    this.swayedTitles.push(
      document.querySelector('#trailerLine') as HTMLElement
    )
    Array.from(document.querySelectorAll('.screenText')).forEach((elem) => {
      // this.swayedScreenTexts.push(elem as HTMLElement)
    })
    // console.log(document.querySelector('#header-section h1'))
    // console.log(this.swayedTitles)
  }

  @Watch('cursorX')
  @Watch('cursorY')
  text3DSway() {
    this.swayedTitles.forEach((elem) => {
      if (elem) {
        const transform = `translateX(${-5 * this.cursorX}px) translateY(${
          -5 * this.cursorY
        }px) rotateX(${-0.8 * this.cursorY}deg) rotateY(${
          0.8 * this.cursorX
        }deg)`
        elem.style.transform = transform
      }
    })
    this.swayedScreenTexts.forEach((elem) => {
      if (elem) {
        const transform = `translateX(${-5 * this.cursorX}px) translateY(${
          -5 * this.cursorY
        }px) rotateX(${-0.8 * this.cursorY}deg) rotateY(${
          -0.8 * this.cursorX
        }deg)`
        elem.style.transform = transform
      }
    })
  }

  initScrollAttempt() {
    if (
      // have mandatory element been rendered yet ?
      document.querySelector('nav.navbar') === null ||
      // document.querySelector('#trailerBrand') === null ||
      document.getElementById('pageUp') === null
    ) {
      setTimeout(() => {
        this.initScrollAttempt()
      }, 50)
    } else {
      const scrollbar = SC.initImmersiveScroller(
        this.scrollAnimDuration,
        this.scrollAnimSeparators,
        this.tabletMagnets
      )
      this.watchScrolling(scrollbar)
      SC.enableScrollMagnetMarkers(this.scrollMagnets)
    }
  }

  watchScrolling(scrollbar: Scrollbar) {
    let lastOffset = 0
    let lastTime = Date.now()

    scrollbar.addListener(() => {
      // get the progress ratio needed for the scrollanimation
      if (
        scrollbar.scrollTop > this.scrollAnimOffsetTop &&
        scrollbar.scrollTop < this.scrollAnimOffsetTop + this.scrollAnimDuration
      ) {
        const relativePosition = scrollbar.scrollTop - this.scrollAnimOffsetTop
        const ratio = relativePosition / this.scrollAnimDuration
        this.scrollAnimRatio = ratio
        this.autoSlide(ratio)
      }

      // get instant velocity from the smooth scrollbar instance (used for snapping)
      const current = Date.now()
      const offset = scrollbar.offset.y
      let duration = current - lastTime

      if (!duration || offset === lastOffset) return

      if (duration > 100) {
        duration -= duration - 1
      }

      this.wheelVelocity = (offset - lastOffset) / duration
      lastTime = current
      lastOffset = offset
    })

    // this listener is not on the smooth scrollbar because it has damping, and we want to fire instantly on scroll stop
    window.addEventListener('wheel', (e) => {
      if (
        scrollbar.scrollTop <
        this.scrollAnimOffsetTop + this.scrollAnimDuration
      ) {
        // Clear our timeout throughout the scroll
        window.clearTimeout(this.onScrollingStop)

        const velocity = Math.abs(this.wheelVelocity)
        // Set a timeout to run after scrolling ends
        this.onScrollingStop = setTimeout(() => {
          this.snapScrolling(scrollbar, e.deltaY > 0)
        }, 150)
      }
    })
  }

  snapScrolling(scrollbar: Scrollbar, forward: boolean) {
    if (
      scrollbar.scrollTop <
      this.scrollAnimOffsetTop +
        this.scrollAnimDuration * this.scrollAnimSeparators.trailerLineEnd
    ) {
      // console.log(this.scrollMagnets)
      let magnets = Object.values(this.scrollMagnets)
      if (forward) {
        // consider only forward magnets
        magnets = magnets.filter((mag) => scrollbar.scrollTop - mag <= 0)
      } else {
        // consider only backward magnets
        magnets = magnets.filter((mag) => scrollbar.scrollTop - mag >= 0)
      }
      if (magnets.length > 0) {
        // sort magnets by proximity
        magnets = magnets.sort(
          (a, b) =>
            Math.abs(scrollbar.scrollTop - a) -
            Math.abs(scrollbar.scrollTop - b)
        )
        // compute duration with distance and speed
        const distance = Math.abs(scrollbar.scrollTop - magnets[0])
        // scroll to the closest
        const speed = 0.7
        scrollbar.scrollTo(0, magnets[0], ((distance / 100) * 100) / speed)
      }
    }
  }

  autoSlide(ratio) {
    let innerRatio
    // beyond ratio limits
    if (ratio <= this.autoSlideMin) {
      innerRatio = 0
    } else if (ratio >= this.autoSlideMax) {
      innerRatio = 1
    } else {
      const range = this.autoSlideMax - this.autoSlideMin
      innerRatio = (ratio - this.autoSlideMin) / range
    }
    this.timeSlidePercent = (1 - innerRatio) * 100
  }

  timeSlide(percent) {
    this.timeSlidePercent = parseInt(percent)
  }

  setLoadScreen(elem) {
    this.loadScreen = elem
  }
}
</script>

<style scoped>
#immersive-section {
  min-height: 100vh;
  min-width: 100%;
  max-width: none !important;
  max-height: none !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: black;
  overflow: hidden;
  /* border: 1px solid red; */
  perspective: 100px;
}
#immersive-stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.stageError {
  position: absolute;
  z-index: 999;
  top: 0px;
  height: 100%;
  width: 100%;
  background: rgb(238, 238, 238);
  display: flex;
  justify-content: center;
  align-items: center;
}
.screenText {
  position: absolute;
  opacity: 0;
  display: none;
  margin: 35px;
  color: white;
  height: 80vh;
  width: 30vw;
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  line-height: 3rem;
  margin-top: 350px;
  transform-style: preserve-3d;
}
#screenText_1,
#screenText_2 {
  left: 0px;
}

#screenText_3 {
  right: 0px;
  text-align: right;
}
#trailerLine {
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-transform: uppercase;
  text-align: center;
  font-size: 8vw;
  color: white;
  display: none;
  opacity: 0;
  transform-style: preserve-3d;
}
#trailerLine #diveInto {
  margin-top: 50vh;
}
#trailerLine #thePast {
  margin-top: -50vh;
}
#frame {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  top: 10vh;
  left: 10vw;
  width: 80vw;
  height: 80vh;
  /* border: 3px dashed red; */
}
</style>

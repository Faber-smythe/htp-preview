<template>
  <section id="immersive-section">
    <ImmersiveHUD
      :site="site"
      :immersive="immersive"
      :title="immersiveTitle"
      :loading="loading"
      :treasure-toggled="treasurePanelToggled"
      :slider-tooltips-labels="sliderTooltipsLabels"
      :time-slide-percent="timeSlidePercent"
      @toggle-treasure="toggleTreasurePanel($event)"
      @time-slide="timeSlide($event)"
    />
    <div id="immersive-stage" ref="immersiveStage">
      <ImmersiveScene
        v-if="loadScreen"
        :site="site"
        :immersive="immersive"
        :time-slide-location="timeSlideLocation"
        :load-screen="loadScreen"
        :tweening="tweening"
        :autopilot-ratio="autopilotPosition"
        :cursor-x="cursorX"
        :cursor-y="cursorY"
        @found-treasure="toggleTreasurePanel()"
      />
      <!-- this Custom Loadscreen is handled in @utils/BabylonCustomLoader.ts -->
      <LoadingScreen @found-load-screen="(e) => setLoadScreen(e)" />
    </div>
    <div id="frame"></div>
  </section>
</template>

<script lang="ts">
// Import libs
import { Component, Prop, Mixins } from 'vue-property-decorator'
// Import components
import ImmersiveHUD from '@/components/site/immersiveSection/ImmersiveHUD.vue'
import ImmersiveScene from '@/components/site/immersiveSection/ImmersiveScene.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
// Import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
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
  @Prop({ type: Boolean, required: false }) readonly gsapScroll!: Boolean
  @Prop({ type: Object, required: true }) readonly immersive!: ImmersiveContent
  @Prop({ type: Object, required: true }) readonly site!: Site

  tweening: boolean = false
  loadScreen = null
  timeSlidePercent: number = 100
  loading: boolean = false
  treasurePanelToggled: string = 'false'

  autopilotDuration: number = window.innerHeight * 5.5
  autopilotOffsetTop: number = window.innerHeight * 5
  autopilotPosition: number = 0
  autoSlideMin: number = 0.25
  autoSlideMax: number = 0.8
  cursorX: number = 0
  cursorY: number = 0

  sliderTooltipsLabels =
    this.immersive &&
    this.immersive.layers.map((layer) => {
      return layer.localizedTimestampTitle
    })

  get immersiveTitle() {
    return (
      this.immersive &&
      this.timeSlideLocation &&
      this.$t(
        this.immersive.layers[this.timeSlideLocation.index].cartelDescription
          .title
      )
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

  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
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

  initScrollAttempt() {
    if (
      document.querySelector('nav.navbar') === null ||
      document.querySelector('#trailerBrand') === null ||
      document.getElementById('pageUp') === null
    ) {
      setTimeout(() => {
        this.initScrollAttempt()
      }, 50)
    } else {
      const scrollbar = SC.initImmersiveScroller(this.autopilotDuration)
      this.autopilotScroll(scrollbar)
    }
  }

  autopilotScroll(scrollbar) {
    scrollbar.addListener(() => {
      if (
        scrollbar.scrollTop > this.autopilotOffsetTop &&
        scrollbar.scrollTop < this.autopilotOffsetTop + this.autopilotDuration
      ) {
        const relativePosition = scrollbar.scrollTop - this.autopilotOffsetTop
        const ratio = relativePosition / this.autopilotDuration
        this.autopilotPosition = ratio
        this.autoSlide(ratio)
      }
    })
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

  toggleTreasurePanel(value?) {
    if (value) {
      this.treasurePanelToggled = value
    } else if (this.treasurePanelToggled === 'true') {
      this.treasurePanelToggled = 'false'
    } else {
      this.treasurePanelToggled = 'true'
    }
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
#frame {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  top: 7.5vh;
  left: 7.5vw;
  width: 85vw;
  height: 85vh;
  /* border: 3px dashed red; */
}
</style>

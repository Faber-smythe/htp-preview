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
      <img id="tabletFrame" ref="frame" :src="frameUri" alt="tablet frame" />
      <ImmersiveScene
        v-if="loadScreen"
        :site="site"
        :immersive="immersive"
        :time-slide-location="timeSlideLocation"
        :load-screen="loadScreen"
        :tweening="tweening"
        @found-treasure="toggleTreasurePanel()"
      />
      <!-- this Custom Loadscreen is handled in @utils/BabylonCustomLoader.ts -->
      <LoadingScreen @found-load-screen="(e) => setLoadScreen(e)" />
    </div>
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

  get frameUri() {
    return require('@/assets/img/tabletFrame.png')
  }

  mounted() {
    // set stage size with correct screen ratio
    this.setStageSize()

    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      SC.initImmersiveScroller(() => {
        this.treasurePanelToggled = 'fullyHidden'
      })
    })
  }

  setStageSize() {
    const stage = this.$refs.immersiveStage as HTMLElement
    const frame = this.$refs.frame as HTMLElement
    const ratio = window.innerWidth / window.innerHeight
    if (ratio < 1.335) {
      const tabletHeight = window.innerHeight
      const tabletWidth = tabletHeight * 1.335
      stage.style.height = `${tabletHeight}px`
      stage.style.width = `${tabletWidth}px`
      frame.style.height = '100%'
      frame.style.transform = 'scale(1.12)'
    } else {
      const tabletWidth = window.innerWidth
      const tabletHeight = tabletWidth / 1.335
      stage.style.height = `${tabletHeight}px`
      stage.style.width = `${tabletWidth}px`
      frame.style.width = '100%'
      frame.style.transform = 'scale(1.18)'
    }
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
}
#immersive-stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
#tabletFrame {
  position: absolute;
  z-index: 50;
  max-width: none;
  max-height: none;
  pointer-events: none;
}
</style>

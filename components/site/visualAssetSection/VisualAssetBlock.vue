<template>
  <div class="visual-block" :style="blockStyle">
    <div class="canvas-holder" :style="blockHalvesStyle">
      <VisualAssetScene
        v-if="block.object"
        :object="block.object"
        :load-screen="loadScreen"
        :site="site"
      />
      <!-- Custom Loadscreen is handled in @utils/BabylonCustomLoader.ts -->
      <LoadingScreen @found-load-screen="(e) => setLoadScreen(e)" />
    </div>
    <div class="block-description" :style="blockHalvesStyle">
      <h2>{{ block.title }}</h2>
      <p v-for="(paragraph, i) in block.text" :key="`paragraph-${i}`">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import components
import VisualAssetScene from '@/components/site/visualAssetSection/VisualAssetScene.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
// import types
import Site from '@/types/Site'
import VisualAsset from '@/types/VisualAsset'

@Component({
  components: {
    VisualAssetScene,
    LoadingScreen,
  },
})
export default class VisualAssetBlock extends Vue {
  @Prop({ type: Object, required: true }) readonly block!: VisualAsset
  @Prop({ type: Object, required: true }) readonly site!: Site

  loadScreen = null

  get blockStyle() {
    let style = 'align-items: center;'
    if (this.block.size === 'small') {
      style += 'justify-content: space-around;'
      if (this.block.order === 'objectFirst') {
        style += 'flex-direction: row;'
      } else if (this.block.order === 'textFirst') {
        style += 'flex-direction: row-reverse;'
      }
    } else if (this.block.size === 'large') {
      if (this.block.order === 'objectFirst') {
        style += 'flex-direction: column;'
      } else if (this.block.order === 'textFirst') {
        style += 'flex-direction: column-reverse;'
      }
    }
    return style
  }

  get blockHalvesStyle() {
    let style = ''
    if (this.block.size === 'small') {
      style += 'position: relative; min-height: 40vh;'
      style += 'width: 46%;'
      style += 'margin: 1%;'
    } else if (this.block.size === 'large') {
      style += 'width: 96%;'
      style += 'margin: 1%;'
    }
    return style
  }

  setLoadScreen(elem) {
    this.loadScreen = elem
  }
}
</script>

<style scoped>
.visual-block {
  position: relative;
  width: 100%;
  display: flex;
  height: fit-content;
  /* border: red; */
}

.canvas-holder {
  position: relative;
  height: 45vh;
  max-width: 80vw;
  /* background: rgba(255, 255, 255, 0.1); */
  border-radius: 15px;
  overflow: hidden;
}

.block-description {
  color: white;
  max-width: 70vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.block-description h2 {
  margin-left: 2rem;
}

.block-description p {
  margin: 1rem 0px;
  text-align: justify;
}
</style>

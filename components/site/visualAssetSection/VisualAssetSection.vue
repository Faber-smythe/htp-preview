<template>
  <section id="visual-asset-section">
    <VisualAssetBlock
      v-for="(visual, i) in visuals"
      :key="`visual-block-${i}`"
      :block="visual"
      :site="site"
    />
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import components
import VisualAssetBlock from '@/components/site/visualAssetSection/VisualAssetBlock.vue'
// import types
import Site from '@/types/Site'
import VisualAsset from '@/types/VisualAsset'
// miscellaneous
// import SC from '@/utils/ScrollController'

@Component({
  components: {
    VisualAssetBlock,
  },
})
export default class SitePage extends Vue {
  @Prop({ type: Array, required: true }) readonly visuals!: VisualAsset[]
  @Prop({ type: Object, required: true }) readonly site!: Site

  mounted() {
    // console.log(this.visuals)
  }
}
</script>

<style scoped>
#visual-asset-section {
  background: black;
  padding: 5vh 5vw;
  width: 90vw;
  margin: 0 auto;
}
</style>

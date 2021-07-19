<template>
  <section id="visual-asset-section">
    <ViewableBlock
      v-for="(viewable, i) in viewables"
      :key="`viewable-block-${i}`"
      :block="viewable"
      :site="site"
    />
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import components
import ViewableBlock from '@/components/site/viewablesSection/ViewableBlock.vue'
// import types
import Site from '@/types/Site'
import Viewable from '@/types/Viewable'
// miscellaneous
// import SC from '@/utils/ScrollController'

@Component({
  components: {
    ViewableBlock,
  },
})
export default class ViewablesSection extends Vue {
  @Prop({ type: Array, required: true }) readonly viewables!: Viewable[]
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

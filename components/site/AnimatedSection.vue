<template>
  <section id="animated-histopad-section">
    <div class="fade-black-top"></div>
    <img
      v-for="(img, i) in imgSrc"
      :key="i"
      :src="imgSrc[i]"
      :class="`stacked-img ${i !== 0 ? 'stagger-img' : ''}`"
      alt=""
    />
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Prop, Vue } from 'vue-property-decorator'
// import types
import Site from '@/types/Site'
// miscellaneous
import SC from '@/utils/ScrollController'

@Component
export default class AnimatedHistopad extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site
  imgSrc: String[] = []
  imgDesc: String[] = [
    'This is a description',
    'This is another description',
    'This is a better description',
    'This is an awesome description',
    'This is the best description',
    'This is an original description',
    'This is a funny description',
    'This is a brand new description',
    'This is the last description',
  ]

  imgCount = 10

  created() {
    // console.log(this.imgSrc)
    for (let i = 0; i < this.imgCount; i++) {
      this.imgSrc.push(
        require(`@/assets/img/sites/${this.site.linkLabel}-multilayer/${i}.png`)
      )
    }
  }

  mounted() {
    SC.initAnimatedHistopadScroller()
  }
}
</script>

<style scoped>
#animated-histopad-section {
  position: relative;
  height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stacked-img {
  position: absolute;
  margin-right: -15vw;
  max-width: 80%;
}
</style>

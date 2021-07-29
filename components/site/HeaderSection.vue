<template>
  <section id="header-section">
    <h1 ref="title"></h1>
    <div class="fade-black-bottom"></div>
    <img id="header-background" ref="headerBackground" :src="headerBg" alt="" />
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import types
import Site from '@/types/Site'
// miscellaneous
import SC from '@/utils/ScrollController'

@Component
export default class SitePage extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site

  headerBg: string = require(`@/assets/img/sites/${this.site!.slug}/header.jpg`)

  mounted() {
    const title = this.$refs.title as HTMLElement
    title.innerHTML = String(this.$t(this.site.site))
    const headerImg = this.$refs.headerBackground as HTMLElement
    title.innerHTML = this.wrapInSpan(title.innerHTML)

    // SC.initSmoothScroll()
    headerImg.onload = () => {
      setTimeout(() => {
        SC.initHeaderScroller()
      }, 200)
    }
  }

  wrapInSpan(string) {
    let wrapped = ''
    const lines = string.split('<br>')
    lines.forEach((line, i) => {
      wrapped += line.replace(/\S/g, "<span class='letter'>$&</span>")
      if (i < lines.length - 1) {
        wrapped += '<br>'
      }
    })
    return wrapped
  }
}
</script>

<style>
#header-section {
  position: relative;
  z-index: 7;
  perspective: 100px;
}
#header-section h1 {
  position: absolute;
  z-index: 5;
  color: #fff;
  font-size: 5rem;
  font-family: 'Roboto';
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
  transform-style: preserve-3d;
}
#header-section h1 .letter {
  display: inline-block;
  line-height: 1em;
  /* opacity: 0; */
  transform: translateY(40px);
}
#header-section #header-background {
  filter: brightness(0.85);
  height: 100vh;
  width: 100%;
  object-fit: cover;
}
#header-section .fade-black-bottom {
  position: absolute;
  z-index: 4;
  bottom: -5px;
  height: 15vh;
  width: 100%;
  background: linear-gradient(transparent, black);
}
</style>

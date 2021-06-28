<template>
  <section id="footer-section">
    <div class="fade-black-top"></div>
    <FooterCarousel :items="site.reviews" />
    <img id="footer-background" ref="headerBackground" :src="footerBg" alt="" />
  </section>
</template>

<script lang="ts">
// import libs
import { Component, Vue, Prop } from 'vue-property-decorator'
// import components
import FooterCarousel from '@/components/site/footerSection/FooterCarousel.vue'
// import types
import Site from '@/types/Site'
// miscellaneous
import SC from '@/utils/ScrollController'

@Component({
  components: {
    FooterCarousel,
  },
})
export default class FooterSection extends Vue {
  @Prop({ type: Object, required: true }) readonly site!: Site

  footerBg: string = require(`@/assets/img/sites/${
    this.site!.linkLabel
  }/footer.jpg`)

  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      SC.initFooterScroller()
    })
  }
}
</script>

<style>
#footer-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
#footer-section h1 {
  position: absolute;
  z-index: 5;
  color: #fff;
  font-size: 5rem;
  font-family: 'Roboto';
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
}
#footer-section #footer-background {
  filter: brightness(0.85);
  height: 100vh;
  width: 100%;
  object-fit: cover;
}
#footer-section .fade-black-top {
  position: absolute;
  z-index: 4;
  top: -5px;
  height: 15vh;
  width: 100%;
  background: linear-gradient(black, transparent);
}
</style>

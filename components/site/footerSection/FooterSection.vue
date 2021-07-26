<template>
  <section id="footer-section">
    <div class="fade-black-top"></div>
    <img id="footer-background" ref="headerBackground" :src="footerBg" alt="" />
    <FooterCarousel :items="site.reviews" />
    <h2>{{ $t('FooterCallout') }}</h2>
    <h2>
      {{ $t('FooterBuyHere') }}
      <a
        id="ticketLinkFooter"
        :href="
          site.ticketLink
            ? site.ticketLink
            : 'https://i.giphy.com/media/5kq0GCjHA8Rwc/giphy.webp'
        "
        target="_blank"
        :title="$t('BuyTheTickets')"
      >
        <img :src="ticketSrc" alt="" /><span>{{ $t('Tickets') }}</span>
      </a>
    </h2>
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
  ticketSrc: string = require('@/assets/img/ticket.png')

  footerBg: string = require(`@/assets/img/sites/${
    this.site!.linkLabel
  }/footer.jpg`)

  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the entire view has been rendered
      SC.initFooterScroller()
    })
  }
}
</script>

<style scoped>
#footer-section {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}
#footer-section h2 {
  z-index: 5;
  color: #fff;
  font-size: 2rem;
  font-weight: 400;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  margin-top: 30px;
  max-width: 90%;
}
#footer-section #footer-background {
  filter: brightness(0.5);
  position: absolute;
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

#ticketLinkFooter {
  height: 4rem;
  margin: 0px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#ticketLinkFooter img {
  height: 100%;
  transition: all 0.3s ease;
}
#ticketLinkFooter span {
  position: absolute;
  z-index: 20;
  padding: 3px 12px;
  border: 1px solid black;
  color: black;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 1.8rem;
}
#ticketLinkFooter:hover img {
  opacity: 0;
}
#ticketLinkFooter:hover span {
  border: 1px solid white;
  color: white;
}
</style>

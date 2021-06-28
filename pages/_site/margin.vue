<template>
  <div id="section-holder" class="container-fluid">
    <HeaderSection v-if="foundSite" :site="site" />
    <!-- <AnimatedSection v-if="foundSite" :site="site" /> -->
    <Folioscope v-if="foundSite" :site="site" />
    <ImmersiveSection v-if="foundSite" :immersive="immersive" :site="site" />
    <VisualAssetSection v-if="foundSite" :visuals="visualAssets" :site="site" />
    <FooterSection v-if="foundSite" :site="site" />

    <!-- below is for  -->
    <h1 v-if="!foundSite" id="no-site">
      We haven't found any site called "{{ $route.params.site }}".<br />
      Check for typos in the url !
    </h1>
    <img id="inactiveArrow" ref="inactiveArrow" src="/img/white_arrow.png" />
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Mixins } from 'vue-property-decorator'
import Scrollbar from 'smooth-scrollbar'
import { gsap } from 'gsap'
// import components
import HeaderSection from '@/components/site/HeaderSection.vue'
import FooterSection from '@/components/site/footerSection/FooterSection.vue'
import AnimatedSection from '@/components/site/AnimatedSection.vue'
import Folioscope from '@/components/site/Folioscope.vue'
import ImmersiveSection from '@/components/site/immersiveSection/ImmersiveSection.vue'
import VisualAssetSection from '@/components/site/visualAssetSection/VisualAssetSection.vue'
// import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
// miscellaneous
import { UtilMixins } from '@/utils/mixins'
import sitesFile from '@/data/sites.json'
import VisualAsset from '@/types/VisualAsset'
import SC from '@/utils/ScrollController'

@Component({
  components: {
    HeaderSection,
    AnimatedSection,
    Folioscope,
    ImmersiveSection,
    VisualAssetSection,
    FooterSection,
  },
})
export default class SitePage extends Mixins(UtilMixins) {
  scrollbar!: Scrollbar

  idleSeconds: number = 0
  inactive: boolean = false
  inactivityClue: gsap.core.Timeline | null = null

  miniScrollToggle: boolean = false

  get foundSite(): boolean {
    return (
      this.site !== null &&
      this.immersive !== null &&
      this.visualAssets.length !== 0
    )
  }

  get site(): Site | null {
    const label = this.$route.params.site
    const sites = sitesFile as Site[]
    const site = sites.find((s) => s.linkLabel === label)! as Site
    return site ?? null
  }

  get immersive(): ImmersiveContent | null {
    if (this.site && this.site.immersive) {
      return require(`@/data/sites/${this.site.immersive.siteID}/${this.site.immersive.file}`) as ImmersiveContent
    } else {
      return null
    }
  }

  get visualAssets(): VisualAsset[] {
    if (this.site && this.site.visualAssets.length) {
      return this.site.visualAssets as VisualAsset[]
    } else {
      return []
    }
  }

  mounted() {
    this.scrollbar = SC.enableSmoothScroll()
    this.startIdleWatcher()
  }

  startIdleWatcher() {
    // count idle duration each tenth of seconds
    setInterval(() => {
      this.idleSeconds += 0.1
      if (this.idleSeconds >= 5) {
        this.becameInactive()
      }
    }, 100)

    // reset idle on certain events
    window.addEventListener('wheel', () => {
      this.nomoreInactive()
    })
  }

  becameInactive() {
    if (this.inactive === false) {
      // declaring
      this.inactive = true // toggle

      const inactiveArrow = this.$refs.inactiveArrow as HTMLElement
      const scroller = this.scrollbar.contentEl as HTMLElement
      const idleLocation = this.scrollbar.scrollTop

      // position the arrow according to current scroll
      inactiveArrow.style.display = 'flex'
      inactiveArrow.style.top = `${
        window.innerHeight * 0.75 + this.scrollbar.scrollTop
      }px`
      // set origin style to interpolate target style correctly
      scroller.style.transform = `translate3d(0px, ${-idleLocation}px, 0px)`
      // create inactivity animation timeline
      this.inactivityClue = gsap
        .timeline()
        .to(
          '#inactiveArrow',
          {
            duration: 1,
            opacity: 1,
            ease: 'power2.out',
          },
          0
        )
        .to(
          scroller,
          {
            duration: 0.8,
            marginTop: '-40px',
            ease: 'power2.out',
          },
          1
        )
        .to(scroller, {
          duration: 0.8,
          marginTop: '0px',
          ease: 'power2.out',
        })
        .repeat(-1)
    }
  }

  nomoreInactive() {
    if (this.inactive === true) {
      // declaring
      const inactiveArrow = this.$refs.inactiveArrow as HTMLElement
      const scroller = this.scrollbar.contentEl as HTMLElement

      // reset idle clue
      inactiveArrow.style.opacity = '0'
      scroller.style.marginTop = '0px'

      this.idleSeconds = 0
      this.inactive = false
      if (this.inactivityClue instanceof gsap.core.Timeline) {
        this.inactivityClue.kill()
      }
      this.inactivityClue = null
    }
  }
}
</script>

<style>
#inactiveArrow {
  position: fixed;
  z-index: 999;
  top: 75vh;
  right: 15px;
  height: 20vh;
  display: none;
  opacity: 0;
  transform: translateY(0px);
}
section {
  /* border: 1px solid red; */
}
#section-holder {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow-x: hidden;
}
#header-section {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-color: rgb(0, 0, 0);
}

.fade-black-top {
  position: absolute;
  top: 0px;
  height: 15vh;
  width: 100%;
  background: linear-gradient(black, transparent);
}

#no-site {
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100vw;
  padding: 10vh 10vw;
  font-size: 3rem;
  background: rgb(40, 40, 40);
  color: #fff;
}

@media screen and (max-width: 767px) {
  .img-shadow {
    box-shadow: inset 0px 0px 70px 30px rgba(0, 0, 0, 0.7);
  }
  .cover h3 {
    font-size: 0.7rem;
  }

  .cover h1 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .play-btn {
    width: 2rem;
  }
}

@media screen and (min-width: 321px) and (max-width: 767px) {
  .background-sceau {
    background-size: auto 20%;
  }
}

@media screen and (max-width: 320px) {
  .background-sceau {
    background-size: auto 10%;
  }
}
</style>

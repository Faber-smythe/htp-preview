<template>
  <main class="container-fluid">
    <!-- 
      NAVIGATION 
    -->
    <NavigationBar :site="site" />
    <!-- 
      SECTIONS 
    -->
    <div id="section-holder" class="container-fluid">
      <HeaderSection v-if="foundValidSite" :site="site" />
      <ImmersiveSection
        v-if="foundValidSite"
        :immersive="immersive"
        :site="site"
      />
      <!-- <ViewablesSection
        v-if="foundValidSite"
        :viewables="viewables"
        :site="site"
      /> -->
      <FooterSection v-if="foundValidSite" :site="site" />
    </div>
    <!-- 
      GLOBAL OVERLAYS -- not side found
    -->
    <h1 v-if="!foundValidSite" id="no-site">
      We haven't found any valid site called "{{ $route.params.site }}".<br />
      Check for typos in the url !
    </h1>
    <!-- 
      GLOBAL OVERLAYS -- scroll clue when idle
    -->
    <div
      v-if="foundValidSite"
      id="inactiveMouseHolder"
      ref="inactiveMouseHolder"
    >
      <div id="inactiveMouse" ref="inactiveMouse">
        <span></span>
      </div>
    </div>
    <!-- 
      GLOBAL OVERLAYS -- "back to the top button"
    -->
    <b-button
      v-if="foundValidSite"
      id="pageUp"
      icon-left="arrow-circle-up"
      :title="$t('BackToTheTop')"
    >
    </b-button>
  </main>
</template>

<script lang="ts">
// import libs
import { Component, Mixins } from 'vue-property-decorator'
import Scrollbar from 'smooth-scrollbar'
import { gsap } from 'gsap'
// import components
import HeaderSection from '@/components/site/HeaderSection.vue'
import FooterSection from '@/components/site/footerSection/FooterSection.vue'
import ImmersiveSection from '@/components/site/immersiveSection/ImmersiveSection.vue'
import ViewablesSection from '@/components/site/viewablesSection/ViewablesSection.vue'
// import types
import Site from '@/types/Site'
import WebImmersive from '@/types/WebImmersive'
import Viewable from '@/types/Viewable'
import Hscene19 from '@/types/Hscene.1.9'
// miscellaneous
import { UtilMixins } from '@/utils/mixins'
import sitesFile from '@/data/sites.json'
import HsceneImmersive from '@/utils/HsceneImmersive'
import SC from '@/utils/ScrollController'

@Component({
  components: {
    HeaderSection,
    ImmersiveSection,
    ViewablesSection,
    FooterSection,
  },
})
export default class SitePage extends Mixins(UtilMixins) {
  scrollbar!: Scrollbar

  idleSeconds: number = 0
  inactive: boolean = true
  inactivityClue: gsap.core.Timeline | null = null

  get foundValidSite(): boolean {
    return (
      this.site !== null &&
      this.immersive !== null &&
      this.viewables.length !== 0
    )
  }

  get site(): Site | null {
    const label = this.$route.params.site
    const sites = sitesFile as unknown as Site[]
    const site = sites.find((s) => s.slug === label && s.enabled) as Site
    return site ?? null
  }

  get immersive(): WebImmersive | null {
    if (this.site && this.site.immersive) {
      if (!this.site.immersive.file.includes('hscene')) {
        return require(`@/data/sites/${this.site.site}/${this.site.immersive.file}.json`) as WebImmersive
      } else {
        // Fallback to .hscene file (from HPDK)
        let hScene
        switch (this.site.immersive.version) {
          // append cases for newly supported versions
          case '1.9':
            hScene =
              require(`@/data/sites/${this.site.site}/${this.site.immersive.file}.json`) as Hscene19
            return new HsceneImmersive(hScene)
          default:
            return null
        }
      }
    } else {
      return null
    }
  }

  get viewables(): Viewable[] {
    if (this.site && this.site.viewables.length) {
      return this.site.viewables as Viewable[]
    } else {
      return []
    }
  }

  mounted() {
    if (this.foundValidSite) {
      this.scrollbar = SC.enableSmoothScroll()

      this.$nextTick(() => {
        // Code that will run only after the entire view has been rendered

        this.startIdleWatcher()

        // handle pageUp event
        document.getElementById('pageUp')!.addEventListener('click', () => {
          this.scrollbar.scrollTo(0, 0, 1500)
        })
      })
    }
  }

  startIdleWatcher() {
    // count idle duration each tenth of seconds
    setInterval(() => {
      if (this.scrollbar.scrollTop < window.innerHeight * 13) {
        this.idleSeconds += 0.1
        if (this.idleSeconds >= 3) {
          this.becameInactive()
        }
      }
    }, 100)

    // reset idle on certain events
    this.scrollbar.addListener(() => {
      this.idleSeconds = 0
      // update inactiveMouse position
      this.nomoreInactive()
    })
  }

  becameInactive() {
    if (this.inactive === false) {
      // declaring
      this.inactive = true // toggle

      const inactiveMouse = this.$refs.inactiveMouse as HTMLElement
      const inactiveMouseHolder = this.$refs.inactiveMouseHolder as HTMLElement

      // position the arrow according to current scroll
      inactiveMouse.classList.remove('hidden')
      inactiveMouseHolder.style.top = `${
        window.innerHeight * 0.9 + this.scrollbar.scrollTop
      }px`

      // create inactivity animation timeline
      this.inactivityClue = gsap
        .timeline()
        .to(
          '#inactiveMouseHolder',
          {
            duration: 1,
            opacity: 1,
            ease: 'power2.out',
          },
          0
        )
        .repeat(-1)
    }
  }

  nomoreInactive() {
    if (this.inactive === true) {
      const inactiveMouse = this.$refs.inactiveMouse as HTMLElement
      inactiveMouse.classList.add('hidden')

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
.scroll-magnet-marker {
  position: absolute;
  z-index: 999;
  right: 25px;
  border-top: 4px solid transparent;
  padding: 4px;
}
#inactiveMouseHolder {
  position: fixed;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0px;
  width: 0px;
  left: 50%;
  top: 90vh;
}
#inactiveMouse {
  position: absolute;
  width: 28px;
  height: 48px;
  border-radius: 11px 11px 15px 15px;
  border: 1px solid #fff;
  box-shadow: inset 10px 20px 120px 60px rgb(0 0 0);
  transition: all 0.5s ease;
  pointer-events: none;
}
#inactiveMouse.hidden {
  opacity: 0;
}
#inactiveMouse span {
  display: block;
  margin: 6px auto;
  width: 2px;
  height: 5px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid transparent;
  animation-duration: 1.5s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-name: inactiveRoll;
}
@keyframes inactiveRoll {
  to {
    margin-top: 100%;
    opacity: 0;
  }
}
#pageUp {
  position: fixed;
  align-self: center;
  bottom: -3rem;
  z-index: 10;
  font-size: 3rem;
  width: 2rem;
  height: 2rem;
  padding: 5px;
  border-radius: 200px;
  border: none;
  color: rgba(255, 255, 255, 0.4) !important;
  background: transparent;
  transition: all 0.3s ease;
}
#section-holder {
  height: 100%;
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
  z-index: 10;
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
</style>

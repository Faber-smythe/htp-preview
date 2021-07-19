<template>
  <div id="section-holder" class="container-fluid">
    <ImmersiveSection v-if="foundSite" :immersive="immersive" :site="site" />

    <h1 v-if="!foundSite" id="no-site">
      We haven't found any site called "{{ $route.params.site }}".<br />
      Check for typos in the url !
    </h1>
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Mixins } from 'vue-property-decorator'
// import components
import ImmersiveSection from '@/components/site/immersiveSection/ImmersiveSection.vue'
// import types
import Site from '@/types/Site'
import ImmersiveContent from '@/types/ImmersiveContent'
// miscellaneous
import { UtilMixins } from '@/utils/mixins'
import sitesFile from '@/data/sites.json'
import VisualAsset from '~/types/VisualAsset'

@Component({
  components: {
    ImmersiveSection,
  },
})
export default class SitePage extends Mixins(UtilMixins) {
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
}
</script>

<style>
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

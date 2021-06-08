<template>
  <div ref="loadScreen" class="brandHolder">
    <img id="logo" :src="logoSrc" alt="histopad logo" />
    <img :src="brandSrc" alt="histopad title" />
  </div>
</template>

<script lang="ts">
// import libs
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LoadingScreen extends Vue {
  brandSrc = require('@/assets/img/brand_nologo.png')
  logoSrc = require('@/assets/img/logo_nobrand.png')

  mounted() {
    this.$emit('found-load-screen', this.$refs.loadScreen as HTMLElement)
  }
}
</script>
<style scoped>
.brandHolder {
  position: absolute;
  z-index: 999;
  top: 0px;
  height: 100%;
  width: 100%;
  background: rgb(238, 238, 238);
  display: flex;
  justify-content: center;
  align-items: center;
}

.brandHolder img {
  position: absolute;
  width: 60%;
}

#logo {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>

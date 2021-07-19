<template>
  <section id="benchHolder">
    <Scene :ratio="ratio" />
  </section>
</template>

<script lang="ts">
// import Vue.js stuff
import { Component, Vue } from 'vue-property-decorator'
import 'babylonjs-loaders'
// import components
import Sequence from '@/components/home/Sequence.vue'
import Scene from '@/components/home/Scrolltests.vue'
// miscellaneous

@Component({
  components: {
    Sequence,
    Scene,
  },
})
export default class scrolltestPage extends Vue {
  ratio: number = 0

  mounted() {
    this.getScrollRatio()
  }

  getScrollRatio() {
    // set up animation relative to scrollable section
    window.addEventListener('scroll', () => {
      this.ratio = window.scrollY / (window.innerHeight * 5)
    })
  }
}
</script>

<style>
html {
  overflow: auto !important;
}
body {
  height: 600vh;
}
nav {
  display: none !important;
}
#benchHolder {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0px;
  left: 0px;
  background: rgb(20, 20, 24);
}
.benchHalf {
  width: 99%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.benchHalf:first-of-type {
  border-bottom: 2px dashed white;
}
.benchHalf:last-of-type {
  border-top: 2px dashed white;
}
.benchCanvas {
  border: 1px solid red;
}
</style>

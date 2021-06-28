<template>
  <b-navbar :transparent="true" :style="navBackground" class="is-dark">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="/img/logos/logo_histopad_white.png" alt="Logo HistoPad" />
      </b-navbar-item>
    </template>
    <template slot="start"> </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <LanguageSwitcher />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { UtilMixins } from '@/utils/mixins'

@Component
export default class NavigationBar extends Mixins(UtilMixins) {
  get navBackground() {
    if (this.isFirefox || this.isIe) {
      return 'background-color : rgba(0, 0, 0, 0.2) !important'
    } else {
      // return 'background-color : rgba(0, 0, 0, 0.1) !important'
      return 'background-color : rgba(0, 0, 0, 0.1) !important; backdrop-filter: blur(10px)'
    }
  }
}
</script>
<style>
nav.navbar {
  position: fixed;
  top: 0px;
  transform-origin: top center;
  width: 100%;
  transition: all 0.3s ease;
}
.navbar-end {
  margin-right: 5vw;
}
.navbar-brand {
  margin-left: 10vw;
}
.navbar-item,
.navbar-item * {
  background: transparent !important;
  color: #fff !important;
  font-size: 1rem;
  padding: 0px;
}
nav.navbar a {
  color: #4a4a4a;
  transition: all 0.2s ease;
}
nav.navbar a:hover {
  color: #4a4a4a75;
}
@media screen and (min-width: 1024px) {
  /* correcting a really ugly buefy padding */
  .navbar-dropdown a.navbar-item {
    /* padding-right: 0px; */
  }
}
</style>

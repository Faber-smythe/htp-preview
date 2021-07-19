<template>
  <b-navbar :transparent="true" :style="navBackground" class="is-dark">
    <template v-if="!isMobile" slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="/img/logos/logo_histopad_white.png" alt="Logo HistoPad" />
      </b-navbar-item>
    </template>
    <template slot="end">
      <!-- TICKET LINK -->
      <a
        id="ticketLinkHeader"
        :href="
          ticketLink
            ? ticketLink
            : 'https://i.giphy.com/media/5kq0GCjHA8Rwc/giphy.webp'
        "
        target="_blank"
        :title="$t('BuyTheTickets')"
      >
        <span>{{ $t('Tickets') }}</span>
        <img :src="ticketSrc" alt="a white ticket form as background" />
      </a>
      <!-- HOME LINK -->
      <a
        id="homeLink"
        href="https://data.photofunky.net/output/image/c/e/e/5/cee52c/photofunky.gif"
        :title="$t('Home')"
      >
        <svg
          width="31"
          height="31"
          viewBox="0 0 31 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.9409 0.847805L1.71119 9.13402C0.641695 9.93106 0 11.1793 0 12.5026V31H10.4657V28.7442C10.4657 25.9471 12.7881 23.571 15.6146 23.6311C18.3494 23.6913 20.5343 25.8869 20.5343 28.5938V31H31V12.5026C31 11.1793 30.3583 9.91602 29.2888 9.11898L18.0744 0.832766C16.5619 -0.280083 14.4534 -0.280083 12.9409 0.847805Z"
            fill="white"
          />
        </svg>
      </a>
      <!-- LANGUAGE SWITCHER - DROPDOWN  -->
      <b-navbar-item tag="div">
        <b-dropdown
          class="languageSwitcherDropdown"
          aria-role="list"
          :triggers="isMobile ? [] : ['hover']"
          position="is-bottom-right"
          style="
            position: relative;
            height: 7.5vh !important;
            min-width: 150px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          "
        >
          <p slot="trigger" class="tag" style="cursor: pointer">
            <span v-if="!isSmartPhone">
              &nbsp;{{ $t(`Language_${$i18n.locale}`) }}</span
            >
          </p>
          <b-dropdown-item
            v-for="locale in availableLocales"
            :key="locale.code"
            aria-role="listitem"
          >
            <a :href="switchLocalePath(locale.code)">{{
              $t(`Language_${locale.code}`)
            }}</a>
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { UtilMixins } from '@/utils/mixins'

@Component
export default class NavigationBar extends Mixins(UtilMixins) {
  @Prop({ type: String, required: true }) readonly ticketLink!: string
  ticketSrc: string = require('@/assets/img/ticket.png')

  get navBackground() {
    if (this.isFirefox || this.isIe) {
      return 'background-color : rgba(0, 0, 0, 0.2) !important'
    } else {
      return ''
    }
  }

  get availableLocales() {
    return Object.values(this.$i18n.locales).filter(
      (i) => i.code !== this.$i18n.locale
    )
  }
}
</script>
<style>
#homeLink {
  color: white;
  font-size: 1.5rem;
  margin: 0px 20px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
#homeLink:hover {
  opacity: 0.5;
}

#ticketLinkHeader {
  height: 2.5rem;
  margin: 0px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#ticketLinkHeader img {
  height: 100%;
  transition: all 0.3s ease;
}
#ticketLinkHeader span {
  position: absolute;
  z-index: 20;
  padding: 3px 12px;
  border: 1px solid black;
  color: black;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
}
#ticketLinkHeader:hover img {
  opacity: 0;
}
#ticketLinkHeader:hover span {
  border: 1px solid white;
  color: white;
}
nav.navbar {
  position: fixed;
  top: 0px;
  transform-origin: top center;
  width: 100%;
  transition: all 0.3s ease;
}
.navbar-end {
  position: relative;
  display: flex;
  align-items: center;
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
.navbar-menu {
  background: none;
}

.languageSwitcherDropdown .dropdown-menu,
nav.navbar {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.languageSwitcherDropdown .dropdown-menu::before,
nav.navbar::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.languageSwitcherDropdown .dropdown-menu {
  left: auto !important;
  right: 0px;
  min-width: 2rem !important;
  /* width: 100%; */
}
.languageSwitcherDropdown .dropdown-menu .dropdown-content {
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 100%;
}
.dropdown-trigger {
  padding: 0px 50px;
}
.dropdown-trigger > p.tag {
  padding: 0px !important;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item {
  padding-right: 0px;
  transition: all 0.4s ease;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item:last-of-type {
  padding-bottom: 0.5rem;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item a {
  padding: 0.3rem 50px;
  padding-right: 42px;
  margin-right: 8px;
  width: 95%;
  transition: all 0.4s ease;
  border: 4px solid transparent;
  border-right: 4px solid transparent;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item:hover a {
  border-right: 4px solid white;
}
@media screen and (min-width: 1024px) {
  /* correcting a really ugly buefy padding */
  .navbar-dropdown a.navbar-item {
    /* padding-right: 0px; */
  }
}
</style>

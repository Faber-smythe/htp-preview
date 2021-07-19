<template>
  <div id="languageHolder">
    <b-dropdown
      class="languageSwitcherDropdown"
      aria-role="list"
      :triggers="isMobile ? [] : ['hover']"
      position="is-bottom-left"
    >
      <p slot="trigger" class="tag" role="button" style="cursor: pointer">
        <span v-if="!isSmartPhone">
          &nbsp;{{ $t(`Language_${$i18n.locale}`) }}</span
        >
      </p>
      <b-dropdown-item
        v-for="locale in availableLocales"
        :key="locale.code"
        aria-role="listitem"
      >
        <!-- <nuxt-link :to="switchLocalePath(locale.code)">
          {{ $t(`Language_${locale.code}`) }}
        </nuxt-link> -->
        <a :href="switchLocalePath(locale.code)">{{
          $t(`Language_${locale.code}`)
        }}</a>
      </b-dropdown-item>
    </b-dropdown>

    <!-- <b-dropdown
      v-if="isMobile"
      :label="$t(`Language_.${selectedLanguage}`)"
      :right="true"
      :hoverable="true"
      :arrowless="true"
    >
      <b-dropdown-item
        v-for="locale in availableLocales"
        :key="locale.code"
        aria-role="listitem"
      >
        <nuxt-link :to="switchLocalePath(locale.code)">
          {{ $t(`Language_.${locale.code}`) }}
        </nuxt-link>
      </b-dropdown-item>
    </b-dropdown> -->
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import { UtilMixins } from '@/utils/mixins'

@Component
export default class LanguageSwitcher extends Mixins(UtilMixins) {
  get availableLocales() {
    return Object.values(this.$i18n.locales).filter(
      (i) => i.code !== this.$i18n.locale
    )
  }
}
</script>
<style>
.languageSwitcherDropdown {
  height: 7vh !important;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
}
.languageSwitcherDropdown .dropdown-menu {
  min-width: 0px;
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.4s ease;
  text-align: right;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item:last-of-type {
  padding-bottom: 1rem;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item a {
  padding: 0.3rem 2rem;
  margin: 0.2rem;
  transition: all 0.4s ease;
  border: 4px solid transparent;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item:hover {
  opacity: 0.9;
}
.languageSwitcherDropdown .dropdown-menu .dropdown-item:hover a {
  border-right: 4px solid #fff;
}
</style>

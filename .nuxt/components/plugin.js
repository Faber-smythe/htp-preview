import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  LanguageSwitcher: () => import('../..\\components\\LanguageSwitcher.vue' /* webpackChunkName: "components/language-switcher" */).then(c => wrapFunctional(c.default || c)),
  LoadingScreen: () => import('../..\\components\\LoadingScreen.vue' /* webpackChunkName: "components/loading-screen" */).then(c => wrapFunctional(c.default || c)),
  NavigationBar: () => import('../..\\components\\NavigationBar.vue' /* webpackChunkName: "components/navigation-bar" */).then(c => wrapFunctional(c.default || c)),
  HomeScene: () => import('../..\\components\\home\\Scene.vue' /* webpackChunkName: "components/home-scene" */).then(c => wrapFunctional(c.default || c)),
  HomeScrolltests: () => import('../..\\components\\home\\Scrolltests.vue' /* webpackChunkName: "components/home-scrolltests" */).then(c => wrapFunctional(c.default || c)),
  HomeSequence: () => import('../..\\components\\home\\Sequence.vue' /* webpackChunkName: "components/home-sequence" */).then(c => wrapFunctional(c.default || c)),
  SiteHeaderSection: () => import('../..\\components\\site\\HeaderSection.vue' /* webpackChunkName: "components/site-header-section" */).then(c => wrapFunctional(c.default || c)),
  SiteFooterCarousel: () => import('../..\\components\\site\\footerSection\\FooterCarousel.vue' /* webpackChunkName: "components/site-footer-carousel" */).then(c => wrapFunctional(c.default || c)),
  SiteFooterSection: () => import('../..\\components\\site\\footerSection\\FooterSection.vue' /* webpackChunkName: "components/site-footer-section" */).then(c => wrapFunctional(c.default || c)),
  SiteImmersiveHUD: () => import('../..\\components\\site\\immersiveSection\\ImmersiveHUD.vue' /* webpackChunkName: "components/site-immersive-h-u-d" */).then(c => wrapFunctional(c.default || c)),
  SiteImmersiveScene: () => import('../..\\components\\site\\immersiveSection\\ImmersiveScene.vue' /* webpackChunkName: "components/site-immersive-scene" */).then(c => wrapFunctional(c.default || c)),
  SiteImmersiveSection: () => import('../..\\components\\site\\immersiveSection\\ImmersiveSection.vue' /* webpackChunkName: "components/site-immersive-section" */).then(c => wrapFunctional(c.default || c)),
  SiteViewablesSectionViewableBlock: () => import('../..\\components\\site\\viewablesSection\\ViewableBlock.vue' /* webpackChunkName: "components/site-viewables-section-viewable-block" */).then(c => wrapFunctional(c.default || c)),
  SiteViewablesSectionViewableScene: () => import('../..\\components\\site\\viewablesSection\\ViewableScene.vue' /* webpackChunkName: "components/site-viewables-section-viewable-scene" */).then(c => wrapFunctional(c.default || c)),
  SiteViewablesSection: () => import('../..\\components\\site\\viewablesSection\\ViewablesSection.vue' /* webpackChunkName: "components/site-viewables-section" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}

import { wrapFunctional } from './utils'

export { default as LanguageSwitcher } from '../..\\components\\LanguageSwitcher.vue'
export { default as LoadingScreen } from '../..\\components\\LoadingScreen.vue'
export { default as NavigationBar } from '../..\\components\\NavigationBar.vue'
export { default as HomeScene } from '../..\\components\\home\\Scene.vue'
export { default as HomeScrolltests } from '../..\\components\\home\\Scrolltests.vue'
export { default as HomeSequence } from '../..\\components\\home\\Sequence.vue'
export { default as SiteHeaderSection } from '../..\\components\\site\\HeaderSection.vue'
export { default as SiteFooterCarousel } from '../..\\components\\site\\footerSection\\FooterCarousel.vue'
export { default as SiteFooterSection } from '../..\\components\\site\\footerSection\\FooterSection.vue'
export { default as SiteImmersiveHUD } from '../..\\components\\site\\immersiveSection\\ImmersiveHUD.vue'
export { default as SiteImmersiveScene } from '../..\\components\\site\\immersiveSection\\ImmersiveScene.vue'
export { default as SiteImmersiveSection } from '../..\\components\\site\\immersiveSection\\ImmersiveSection.vue'
export { default as SiteViewablesSectionViewableBlock } from '../..\\components\\site\\viewablesSection\\ViewableBlock.vue'
export { default as SiteViewablesSectionViewableScene } from '../..\\components\\site\\viewablesSection\\ViewableScene.vue'
export { default as SiteViewablesSection } from '../..\\components\\site\\viewablesSection\\ViewablesSection.vue'

export const LazyLanguageSwitcher = import('../..\\components\\LanguageSwitcher.vue' /* webpackChunkName: "components/language-switcher" */).then(c => wrapFunctional(c.default || c))
export const LazyLoadingScreen = import('../..\\components\\LoadingScreen.vue' /* webpackChunkName: "components/loading-screen" */).then(c => wrapFunctional(c.default || c))
export const LazyNavigationBar = import('../..\\components\\NavigationBar.vue' /* webpackChunkName: "components/navigation-bar" */).then(c => wrapFunctional(c.default || c))
export const LazyHomeScene = import('../..\\components\\home\\Scene.vue' /* webpackChunkName: "components/home-scene" */).then(c => wrapFunctional(c.default || c))
export const LazyHomeScrolltests = import('../..\\components\\home\\Scrolltests.vue' /* webpackChunkName: "components/home-scrolltests" */).then(c => wrapFunctional(c.default || c))
export const LazyHomeSequence = import('../..\\components\\home\\Sequence.vue' /* webpackChunkName: "components/home-sequence" */).then(c => wrapFunctional(c.default || c))
export const LazySiteHeaderSection = import('../..\\components\\site\\HeaderSection.vue' /* webpackChunkName: "components/site-header-section" */).then(c => wrapFunctional(c.default || c))
export const LazySiteFooterCarousel = import('../..\\components\\site\\footerSection\\FooterCarousel.vue' /* webpackChunkName: "components/site-footer-carousel" */).then(c => wrapFunctional(c.default || c))
export const LazySiteFooterSection = import('../..\\components\\site\\footerSection\\FooterSection.vue' /* webpackChunkName: "components/site-footer-section" */).then(c => wrapFunctional(c.default || c))
export const LazySiteImmersiveHUD = import('../..\\components\\site\\immersiveSection\\ImmersiveHUD.vue' /* webpackChunkName: "components/site-immersive-h-u-d" */).then(c => wrapFunctional(c.default || c))
export const LazySiteImmersiveScene = import('../..\\components\\site\\immersiveSection\\ImmersiveScene.vue' /* webpackChunkName: "components/site-immersive-scene" */).then(c => wrapFunctional(c.default || c))
export const LazySiteImmersiveSection = import('../..\\components\\site\\immersiveSection\\ImmersiveSection.vue' /* webpackChunkName: "components/site-immersive-section" */).then(c => wrapFunctional(c.default || c))
export const LazySiteViewablesSectionViewableBlock = import('../..\\components\\site\\viewablesSection\\ViewableBlock.vue' /* webpackChunkName: "components/site-viewables-section-viewable-block" */).then(c => wrapFunctional(c.default || c))
export const LazySiteViewablesSectionViewableScene = import('../..\\components\\site\\viewablesSection\\ViewableScene.vue' /* webpackChunkName: "components/site-viewables-section-viewable-scene" */).then(c => wrapFunctional(c.default || c))
export const LazySiteViewablesSection = import('../..\\components\\site\\viewablesSection\\ViewablesSection.vue' /* webpackChunkName: "components/site-viewables-section" */).then(c => wrapFunctional(c.default || c))

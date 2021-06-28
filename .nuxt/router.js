import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1649a80e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _853a130a = () => interopDefault(import('..\\pages\\_site\\margin.vue' /* webpackChunkName: "pages/_site/margin" */))
const _2744654f = () => interopDefault(import('..\\pages\\_site\\scene.vue' /* webpackChunkName: "pages/_site/scene" */))
const _cd9a7832 = () => interopDefault(import('..\\pages\\_site\\sequence-canvas.vue' /* webpackChunkName: "pages/_site/sequence-canvas" */))
const _19ff62f8 = () => interopDefault(import('..\\pages\\_site\\sequence-css.vue' /* webpackChunkName: "pages/_site/sequence-css" */))
const _dfe23ad6 = () => interopDefault(import('..\\pages\\_site\\index.vue' /* webpackChunkName: "pages/_site/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/de",
    component: _1649a80e,
    name: "index___de"
  }, {
    path: "/de",
    component: _1649a80e,
    name: "index___de"
  }, {
    path: "/en",
    component: _1649a80e,
    name: "index___en"
  }, {
    path: "/en",
    component: _1649a80e,
    name: "index___en"
  }, {
    path: "/fr",
    component: _1649a80e,
    name: "index___fr"
  }, {
    path: "/fr",
    component: _1649a80e,
    name: "index___fr"
  }, {
    path: "/de/de",
    component: _1649a80e,
    name: "index___de___de"
  }, {
    path: "/de/en",
    component: _1649a80e,
    name: "index___en___de"
  }, {
    path: "/de/fr",
    component: _1649a80e,
    name: "index___fr___de"
  }, {
    path: "/en/de",
    component: _1649a80e,
    name: "index___de___en"
  }, {
    path: "/en/en",
    component: _1649a80e,
    name: "index___en___en"
  }, {
    path: "/en/fr",
    component: _1649a80e,
    name: "index___fr___en"
  }, {
    path: "/fr/de",
    component: _1649a80e,
    name: "index___de___fr"
  }, {
    path: "/fr/en",
    component: _1649a80e,
    name: "index___en___fr"
  }, {
    path: "/fr/fr",
    component: _1649a80e,
    name: "index___fr___fr"
  }, {
    path: "/de/de/:site/margin",
    component: _853a130a,
    name: "site-margin___de___de"
  }, {
    path: "/de/de/:site/scene",
    component: _2744654f,
    name: "site-scene___de___de"
  }, {
    path: "/de/de/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___de___de"
  }, {
    path: "/de/de/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___de___de"
  }, {
    path: "/de/en/:site/margin",
    component: _853a130a,
    name: "site-margin___en___de"
  }, {
    path: "/de/en/:site/scene",
    component: _2744654f,
    name: "site-scene___en___de"
  }, {
    path: "/de/en/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___en___de"
  }, {
    path: "/de/en/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___en___de"
  }, {
    path: "/de/fr/:site/margin",
    component: _853a130a,
    name: "site-margin___fr___de"
  }, {
    path: "/de/fr/:site/scene",
    component: _2744654f,
    name: "site-scene___fr___de"
  }, {
    path: "/de/fr/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___fr___de"
  }, {
    path: "/de/fr/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___fr___de"
  }, {
    path: "/en/de/:site/margin",
    component: _853a130a,
    name: "site-margin___de___en"
  }, {
    path: "/en/de/:site/scene",
    component: _2744654f,
    name: "site-scene___de___en"
  }, {
    path: "/en/de/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___de___en"
  }, {
    path: "/en/de/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___de___en"
  }, {
    path: "/en/en/:site/margin",
    component: _853a130a,
    name: "site-margin___en___en"
  }, {
    path: "/en/en/:site/scene",
    component: _2744654f,
    name: "site-scene___en___en"
  }, {
    path: "/en/en/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___en___en"
  }, {
    path: "/en/en/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___en___en"
  }, {
    path: "/en/fr/:site/margin",
    component: _853a130a,
    name: "site-margin___fr___en"
  }, {
    path: "/en/fr/:site/scene",
    component: _2744654f,
    name: "site-scene___fr___en"
  }, {
    path: "/en/fr/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___fr___en"
  }, {
    path: "/en/fr/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___fr___en"
  }, {
    path: "/fr/de/:site/margin",
    component: _853a130a,
    name: "site-margin___de___fr"
  }, {
    path: "/fr/de/:site/scene",
    component: _2744654f,
    name: "site-scene___de___fr"
  }, {
    path: "/fr/de/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___de___fr"
  }, {
    path: "/fr/de/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___de___fr"
  }, {
    path: "/fr/en/:site/margin",
    component: _853a130a,
    name: "site-margin___en___fr"
  }, {
    path: "/fr/en/:site/scene",
    component: _2744654f,
    name: "site-scene___en___fr"
  }, {
    path: "/fr/en/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___en___fr"
  }, {
    path: "/fr/en/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___en___fr"
  }, {
    path: "/fr/fr/:site/margin",
    component: _853a130a,
    name: "site-margin___fr___fr"
  }, {
    path: "/fr/fr/:site/scene",
    component: _2744654f,
    name: "site-scene___fr___fr"
  }, {
    path: "/fr/fr/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___fr___fr"
  }, {
    path: "/fr/fr/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___fr___fr"
  }, {
    path: "/de/:site",
    component: _dfe23ad6,
    name: "site___de"
  }, {
    path: "/de/:site",
    component: _dfe23ad6,
    name: "site___de___de"
  }, {
    path: "/de/:site",
    component: _dfe23ad6,
    name: "site___en___de"
  }, {
    path: "/de/:site",
    component: _dfe23ad6,
    name: "site___fr___de"
  }, {
    path: "/de/:site",
    component: _dfe23ad6,
    name: "site___de"
  }, {
    path: "/en/:site",
    component: _dfe23ad6,
    name: "site___de___en"
  }, {
    path: "/en/:site",
    component: _dfe23ad6,
    name: "site___en"
  }, {
    path: "/en/:site",
    component: _dfe23ad6,
    name: "site___en___en"
  }, {
    path: "/en/:site",
    component: _dfe23ad6,
    name: "site___fr___en"
  }, {
    path: "/en/:site",
    component: _dfe23ad6,
    name: "site___en"
  }, {
    path: "/fr/:site",
    component: _dfe23ad6,
    name: "site___de___fr"
  }, {
    path: "/fr/:site",
    component: _dfe23ad6,
    name: "site___en___fr"
  }, {
    path: "/fr/:site",
    component: _dfe23ad6,
    name: "site___fr"
  }, {
    path: "/fr/:site",
    component: _dfe23ad6,
    name: "site___fr___fr"
  }, {
    path: "/fr/:site",
    component: _dfe23ad6,
    name: "site___fr"
  }, {
    path: "/de/:site/margin",
    component: _853a130a,
    name: "site-margin___de"
  }, {
    path: "/de/:site/margin",
    component: _853a130a,
    name: "site-margin___de"
  }, {
    path: "/de/:site/scene",
    component: _2744654f,
    name: "site-scene___de"
  }, {
    path: "/de/:site/scene",
    component: _2744654f,
    name: "site-scene___de"
  }, {
    path: "/de/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___de"
  }, {
    path: "/de/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___de"
  }, {
    path: "/de/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___de"
  }, {
    path: "/de/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___de"
  }, {
    path: "/en/:site/margin",
    component: _853a130a,
    name: "site-margin___en"
  }, {
    path: "/en/:site/margin",
    component: _853a130a,
    name: "site-margin___en"
  }, {
    path: "/en/:site/scene",
    component: _2744654f,
    name: "site-scene___en"
  }, {
    path: "/en/:site/scene",
    component: _2744654f,
    name: "site-scene___en"
  }, {
    path: "/en/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___en"
  }, {
    path: "/en/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___en"
  }, {
    path: "/en/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___en"
  }, {
    path: "/en/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___en"
  }, {
    path: "/fr/:site/margin",
    component: _853a130a,
    name: "site-margin___fr"
  }, {
    path: "/fr/:site/margin",
    component: _853a130a,
    name: "site-margin___fr"
  }, {
    path: "/fr/:site/scene",
    component: _2744654f,
    name: "site-scene___fr"
  }, {
    path: "/fr/:site/scene",
    component: _2744654f,
    name: "site-scene___fr"
  }, {
    path: "/fr/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___fr"
  }, {
    path: "/fr/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas___fr"
  }, {
    path: "/fr/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___fr"
  }, {
    path: "/fr/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css___fr"
  }, {
    path: "/",
    component: _1649a80e,
    name: "index"
  }, {
    path: "/:site",
    component: _dfe23ad6,
    name: "site"
  }, {
    path: "/:site/margin",
    component: _853a130a,
    name: "site-margin"
  }, {
    path: "/:site/scene",
    component: _2744654f,
    name: "site-scene"
  }, {
    path: "/:site/sequence-canvas",
    component: _cd9a7832,
    name: "site-sequence-canvas"
  }, {
    path: "/:site/sequence-css",
    component: _19ff62f8,
    name: "site-sequence-css"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

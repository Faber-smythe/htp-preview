import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1649a80e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _52a0d14d = () => interopDefault(import('..\\pages\\_site.vue' /* webpackChunkName: "pages/_site" */))

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
    path: "/de/de/:site",
    component: _52a0d14d,
    name: "site___de___de"
  }, {
    path: "/de/en/:site",
    component: _52a0d14d,
    name: "site___en___de"
  }, {
    path: "/de/fr/:site",
    component: _52a0d14d,
    name: "site___fr___de"
  }, {
    path: "/en/de/:site",
    component: _52a0d14d,
    name: "site___de___en"
  }, {
    path: "/en/en/:site",
    component: _52a0d14d,
    name: "site___en___en"
  }, {
    path: "/en/fr/:site",
    component: _52a0d14d,
    name: "site___fr___en"
  }, {
    path: "/fr/de/:site",
    component: _52a0d14d,
    name: "site___de___fr"
  }, {
    path: "/fr/en/:site",
    component: _52a0d14d,
    name: "site___en___fr"
  }, {
    path: "/fr/fr/:site",
    component: _52a0d14d,
    name: "site___fr___fr"
  }, {
    path: "/de/:site",
    component: _52a0d14d,
    name: "site___de"
  }, {
    path: "/de/:site",
    component: _52a0d14d,
    name: "site___de"
  }, {
    path: "/en/:site",
    component: _52a0d14d,
    name: "site___en"
  }, {
    path: "/en/:site",
    component: _52a0d14d,
    name: "site___en"
  }, {
    path: "/fr/:site",
    component: _52a0d14d,
    name: "site___fr"
  }, {
    path: "/fr/:site",
    component: _52a0d14d,
    name: "site___fr"
  }, {
    path: "/",
    component: _1649a80e,
    name: "index"
  }, {
    path: "/:site",
    component: _52a0d14d,
    name: "site"
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

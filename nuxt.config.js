import i18n from './i18n'
import { routes } from './i18n'

export default {
  ssr: false, // fixed this > Reference Error : navigator not defined
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Histopad',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'dev work on nuxt/ts/babylon version',
      },
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    link: [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    // script: [
    //   {
    //     src: 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js',
    // async: 'async',
    // ssr: false,
    // defer: true,
    // body: true,
    //   },
    // ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '@/plugins/vue-tooltip.ts',
    // '@/plugins/gsap-scrolltrigger.ts',
    '@/plugins/i18n.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  _modules: [
    // https://go.nuxtjs.dev/buefy
    [
      'nuxt-buefy',
      {
        defaultIconPack: 'fas',
        materialDesignIconsHRef:
          'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
      },
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://i18n.nuxtjs.org/setup
    [
      'nuxt-i18n',
      {
        parsePages: false, // Disable babel parsing
        pages: {
          '_site/index': {
            en: '/:site',
            fr: '/:site',
            de: '/:site',
          },
        },
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          alwaysRedirect: true,
          onlyOnRoot: true, // recommended for seo
        },
        defaultLocale: 'en',
        seo: true,
        strategy: 'prefix',
        langDir: 'locales/',
        locales: [
          {
            code: 'en',
            name: 'English',
            iso: 'en-US',
            file: 'en.ts',
          },
          {
            code: 'fr',
            name: 'Français',
            iso: 'fr-FR',
            file: 'fr.ts',
          },
          {
            code: 'de',
            name: 'Deutsch  ',
            iso: 'de-DE',
            file: 'de.ts',
          },
        ],
        vueI18n: i18n,
      },
    ],
  ],
  get modules_1() {
    return this._modules
  },
  set modules_1(value) {
    this._modules = value
  },
  get modules() {
    return this._modules
  },
  set modules(value) {
    this._modules = value
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['gsap'],
  },
  generate: {
    routes,
  },
}

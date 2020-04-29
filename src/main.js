import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueI18n from 'vue-i18n'
import { languages, defaultLocale } from './i18n'

const messages = Object.assign(languages)

Vue.config.productionTip = false

Vue.use(Buefy)

//I18n
Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: defaultLocale,
	messages,
})

new Vue({
	i18n,
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')

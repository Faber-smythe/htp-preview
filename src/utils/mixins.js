import is from 'is_js'

export let utilsMixin = {
	computed: {
		todayYear() {
			return new Date().getFullYear()
		},
		isSmartPhone() {
			let toMatch = [
				/Android/i,
				/webOS/i,
				/iPhone/i,
				/iPad/i,
				/iPod/i,
				/BlackBerry/i,
				/Windows Phone/i,
			]

			let match = toMatch.some((toMatchItem) => {
				return navigator.userAgent.match(toMatchItem)
			})

			return match
		},
		isLandscape() {
			let isLandscape = window.innerHeight < window.innerWidth
			console.log('isLandscape', isLandscape)
			return isLandscape
		},
		navigatorLanguage() {
			let language = window.navigator.language
			if (!language) language = 'fr'
			if (language.indexOf('-') > -1) {
				language = language.split('-')[0]
			}
			if (this.languages && this.languages.indexOf(language) == -1) {
				language = 'en'
			} else {
				language = 'en'
			}
			return language
		},
		isFirefox() {
			return is.firefox()
		},
		isSafariOrIOS() {
			return is.ios() || is.safari()
		},
	},
	methods: {
		goBack() {
			window.history.back()
		}
	},
}


export let utilsMixin = {
	computed: {
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
		}
	},
}

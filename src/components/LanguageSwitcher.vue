<template>
	<b-dropdown aria-role="list" position="is-bottom-left">
		<p class="tag" slot="trigger" role="button" style="cursor: pointer;">
			<img
				:src="`/img/flags/${selectedLanguage}.svg`"
				:alt="selectedLanguage"
				style="width: 1em; height: 1em; margin-right: 0.5em;"
			/>
			<span v-if="!isSmartPhone">
			&nbsp;{{ $t(`language.${selectedLanguage}`) }}</span>
		</p>

		<b-dropdown-item
			aria-role="listitem"
			v-for="language in languages"
			:key="language"
			@click="onLanguageChange(language)"
		>
			<img
				:src="`/img/flags/${language}.svg`"
				:alt="language"
				style="width: 1em; height: 1em; margin-right: 0.5em;"
			/>{{ $t(`language.${language}`) }}
		</b-dropdown-item>
	</b-dropdown>
</template>

<script>
export default {
	name: 'LanguageSwitcher',
	data() {
		return {
			languages: ['en', 'fr'],
			selectedLanguage: 'fr',
		}
	},
	mounted() {
		this.selectedLanguage = !localStorage.getItem('locale')
			? this.navigatorLanguage
			: localStorage.getItem('locale')
		this.onLanguageChange(this.selectedLanguage)
	},
	computed: {
		navigatorLanguage() {
			let language = window.navigator.language
			if (!language) language = 'fr'
			if (language.indexOf('-') > -1) {
				language = language.split('-')[0]
			}
			if (this.languages.indexOf(language) == -1) {
				language = 'en'
			}
			return language
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
	},
	methods: {
		onLanguageChange(language) {
			this.selectedLanguage = language
			this.$i18n.locale = this.selectedLanguage
			localStorage.setItem('locale', this.selectedLanguage)
		},
	},
}
</script>

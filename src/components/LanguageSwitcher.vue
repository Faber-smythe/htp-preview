<template>
	<div>
		<div>
			<b-dropdown aria-role="list" position="is-bottom-left" v-if="!isMobile">
				<p class="tag" slot="trigger" role="button" style="cursor: pointer;">
					<img
						:src="`/img/flags/${selectedLanguage}.svg`"
						:alt="selectedLanguage"
						style="width: 1em; height: 1em; margin-right: 0.5em;"
					/>
					<span v-if="!isSmartPhone">
						&nbsp;{{ $t(`language.${selectedLanguage}`) }}</span
					>
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
		</div>
		<b-navbar-dropdown
			v-if="isMobile"
			:label="$t(`language.${selectedLanguage}`)"
			:right="true"
			:hoverable="true"
			:arrowless="true"
		>
			<b-navbar-item
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
			</b-navbar-item>
		</b-navbar-dropdown>
	</div>
</template>

<script>
import { utilsMixin } from '../utils/mixins'

export default {
	name: 'LanguageSwitcher',
	mixins: [utilsMixin],
	data() {
		return {
			languages: ['fr', 'en', 'de'],
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

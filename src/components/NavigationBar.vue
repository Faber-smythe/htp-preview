<template>
	<b-navbar>
		<template slot="brand">
			<!--<b-navbar-item tag="router-link" :to="{ path: '/' }">
				<img
					src="/img/logos/logo_histopad.png"
					alt="Lightweight UI components for Vue.js based on Bulma"
				/>
			</b-navbar-item>-->
		</template>
		<template slot="start"> </template>

		<template slot="end">
			<b-navbar-item href="/">
				{{ $t('home') }}
			</b-navbar-item>
			<b-navbar-dropdown :label="$t('augmented_visits')">
				<b-navbar-item
					:href="`/${partner.linkLabel}`"
					v-for="partner in partners"
					:key="partner.site"
				>
					{{ $t(partner.site) }}
				</b-navbar-item>
			</b-navbar-dropdown>
			<b-navbar-item tag="div">
				<LanguageSwitcher />
			</b-navbar-item>
		</template>
	</b-navbar>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher'
import sites from '../data/sites.json'

export default {
	name: 'NavigationBar',
	components: {
		LanguageSwitcher,
	},
	data() {
		return {
			partners: [],
		}
	},
	mounted() {
		//Filter site with immersives and available for display
		this.partners = sites.filter((site) => {
			return site.immersives && site.immersives.length > 0 && site.display
		})
	},
}
</script>

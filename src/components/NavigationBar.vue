<template>
	<b-navbar :transparent="true" class="is-dark">
		<template slot="brand">
			<b-navbar-item tag="router-link" :to="{ path: '/' }">
				<img src="/img/logos/logo_histopad_white.png" alt="Logo HistoPad" />
			</b-navbar-item>
		</template>
		<template slot="start"> </template>

		<template slot="end">
			<b-navbar-dropdown
				:label="$t('augmented_visits')"
				:right="true"
				:hoverable="true"
				:arrowless="true"
			>
				<b-navbar-item
					:id="'augmented-visit-dropdown'"
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
<style scoped>
nav.navbar {
	background: transparent;
}

.navbar-link.is-arrowless a {
	color: white;
}
</style>

<template>
	<footer class="home-footer">
		<div class="content has-text-centered">
			<p>
				HistoPad Teaser - version {{ pkgVersion }} - Copyright
				<strong><a href="https://www.histovery.com">Histovery</a></strong>
				2020
			</p>
		</div>
	</footer>
</template>

<script>
import pkg from '../../package.json'

export default {
	name: 'Footer',
	computed: {
		pkgVersion() {
			return pkg.version
		},
	},
}
</script>
<style scoped>
.home-footer {
	background-color: black;
	padding: 3rem 1.5rem 6rem;
	display: block;
	color: white;
}

.home-footer a,
.modal a {
	color: white;
}

.home-footer a:hover,
.modal a:hover {
	color: lightgray;
}
</style>

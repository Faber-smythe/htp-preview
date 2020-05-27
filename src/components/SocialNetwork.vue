<template>
	<section class="home-section social-network">
		<div class="container header-intro" style="text-align: center;">
			<h2 class="title-font">{{ $t('to_know_more') }}</h2>
			<br />
			<a target="_blank" href="https://www.histovery.com"
				><img src="/img/logos/internet.png"
			/></a>
			<a target="_blank" href="https://www.facebook.com/Histovery/"
				><img src="/img/logos/facebook.png"
			/></a>
			<a target="_blank" href="https://www.instagram.com/histovery/"
				><img src="/img/logos/instagram.png"
			/></a>
			<a target="_blank" href="https://twitter.com/histovery"
				><img src="/img/logos/twitter.png"
			/></a>
			<a target="_blank" href="https://vimeo.com/histopad"><img src="/img/logos/vimeo.png"/></a>
			<br /><br />
		</div>
	</section>
</template>

<script>
export default {
    name: 'SocialNetwork'
}
</script>

<style scoped>
.social-network img {
	width: 2.5rem;
	margin: 0.4em;
}
</style>

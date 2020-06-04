<template>
	<div class="tile is-ancestor" style="width: 103%">
		<div class="tile is-6 is-vertical is-parent" style="padding: 0 !important;">
			<div
				class="tile is-child box"
				style="margin: 0 !important; padding: 0 !important;"
			>
				<div
					class="container title-font"
					style="background-color: #460012; 
                        color: white; 
                        text-align: center;"
				>
					<h2 class="promo-font" v-html="$t('collections')"></h2>
				</div>
			</div>
			<div
				class="tile is-child box"
				style="margin: 0 !important; padding: 0 !important;"
			>
				<div class="container">
					<div
						:style="
							`background-image: url(/img/partners/${linkLabel}-1.jpg); 
                            width:100%; 
                            min-height: 644px; 
                            background-size:cover; 
                            background-position: center;`
						"
					></div>
				</div>
			</div>
		</div>
		<div
			class="tile is-6 is-vertical is-parent"
			style="padding: 0 0 0 0 !important;"
		>
			<div
				class="tile is-child box"
				style="margin: 0 !important; padding: 0 0 0 0 !important;"
			>
				<div
					:style="
						`background-image: url(/img/partners/${linkLabel}-2.jpg); 
                        width:100%; min-height: 500px;
						background-size:cover;
						background-position: center;`
					"
				></div>
			</div>
			<div class="tile is-parent" style="padding: 0 !important;">
				<div
					class="tile is-child box is-8"
					style="margin: 0 !important; padding: 0 !important;"
				>
					<div
						class="container-fluid title-font"
						style="background-color: #755131; 
							color: white; 
							min-height: 244px;
							text-align:center;"
					>
						<h2 class="promo-font" v-html="$t('treasure_hunt')"></h2>
					</div>
				</div>
				<div
					class="tile is-child box is-4"
					style="margin: 0 !important; padding: 0 !important;"
				>
					<div
						style="background-image: url(/img/partners/coffre_tresor.jpg); width:100%; 
							min-height: 244px;
							background-size:cover;
							background-position: center;"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SitePromo',
	props: {
		linkLabel: String,
	},
}
</script>

<style scoped>
.promo-font {
	font-size: 1.5rem;
	padding: 2rem;
}

h2 i {
	font-family: 'EB Garamond', serif !important;
}
</style>

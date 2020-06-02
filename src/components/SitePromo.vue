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
						style="background-image: url(/img/partners/donjon_de_loches.jpg); 
                            width:100%; 
                            min-height: 494px; 
                            background-size:cover; 
                            background-position: center;"
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
					style="background-image: url(/img/partners/forteresse_royale_chinon.jpg); 
                        width:100%; min-height: 350px;
						background-size:cover;
						background-position: center;"
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

<style scoped>
.promo-font {
	font-size: 1.5rem;
	padding: 2rem;
}

h2 i {
	font-family: 'EB Garamond', serif !important;
}
</style>

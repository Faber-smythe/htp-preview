<template>
	<div id="app">
		<!--<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link> |
			<router-link to="/map">Map</router-link>
		</div>-->
		<router-view />
	</div>
</template>

<style>
#app {
	font-family: Roboto, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/*text-align: center;*/
	color: #2c3e50;
}

.title-font {
	font-family: Poppins, Helvetica, Arial, sans-serif;
	opacity: 1.0!important;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>

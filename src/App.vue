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
	opacity: 1 !important;
}

.header-intro {
	color: black;
	text-align: center;
}

.header-intro h1 {
	font-size: 2.5rem;
}

.header-intro h2 {
	font-size: 1.5rem;
}

.header-intro h3 {
	font-size: 1rem;
}

.home-section {
	padding: 1.5rem;
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

a,
.carousel a {
	color: white;
}

a:hover,
.carousel a:hover {
	color: gray;
}

.carousel .carousel-indicator .indicator-item .indicator-style {
	display: block;
    border: 1px solid white !important;
    background: rgba(0, 0, 0, 0.0) !important;
    outline: none;
    -webkit-transition: 150ms ease-out;
    transition: 150ms ease-out;
}

.carousel .carousel-indicator .indicator-item.is-active .indicator-style {
	background: white !important;
    border: 1px solid white;
}


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

.main-logo {
	max-width: 25%;
	height: auto;
}

@media screen and (max-width: 767px) {
	.header-intro h1 {
		font-size: 2rem;
	}
}
</style>

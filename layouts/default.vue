<template>
  <main class="container-fluid">
    <NavigationBar />

    <b-button id="pageUp" icon-left="arrow-circle-up"> </b-button>
    <nuxt />
  </main>
</template>

<script lang="ts">
export default {}
</script>
<style>
html {
  overflow: hidden;
}
body {
  background: black;
}
.scrollbar-track {
  z-index: 999 !important;
}
main {
  display: flex;
  flex-direction: column;
}
#pageUp {
  position: fixed;
  align-self: center;
  bottom: -3rem;
  z-index: 10;
  font-size: 3rem;
  width: 2rem;
  height: 2rem;
  padding: 5px;
  border-radius: 200px;
  border: none;
  color: white;
  background: transparent;
  transition: all 0.3s ease;
  opacity: 0.5;
}

#pageUp:hover {
  opacity: 1;
  background: black;
}

.title-font {
  font-family: Poppins, Helvetica, Arial, sans-serif;
}

.header-intro {
  color: black;
  text-align: center;
}

h1,
h2 {
  font-size: 2rem;
}

.header-section {
  text-align: center;
  padding-top: 4rem;
}

.header-section h1 {
  color: white;
}

.home-section .container {
  max-width: 75rem !important;
}

.header-intro h3 {
  font-size: 1.5rem;
}

.header-intro h4 {
  font-size: 1rem;
}

.home-section {
  padding: 3rem;
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

#augmented-visits-menu .navbar-dropdown {
  border-radius: 6px;
}

a:hover,
.carousel a:hover {
  color: gray;
}

.carousel .carousel-indicator .indicator-item .indicator-style {
  display: block;
  border: 1px solid white !important;
  background: rgba(0, 0, 0, 0) !important;
  outline: none;
  -webkit-transition: 150ms ease-out;
  transition: 150ms ease-out;
}

.carousel .carousel-indicator .indicator-item.is-active .indicator-style {
  background: white !important;
  border: 1px solid white;
}

.main-logo {
  max-width: 30%;
  height: auto;
}

@media screen and (max-width: 767px) {
  .header-intro h1 {
    font-size: 2rem;
  }

  .header-intro h2 {
    font-size: 1.1rem;
  }

  .main-logo {
    max-width: 60%;
    height: auto;
  }
}
</style>

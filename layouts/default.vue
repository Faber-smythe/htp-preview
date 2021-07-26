<template>
  <nuxt />
</template>

<script lang="ts">
export default {}
</script>
<style>
html,
body,
#__nuxt,
#__layout,
main {
  position: relative;
  height: 100%;
}
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
  color: rgba(255, 255, 255, 0.2) !important;
  background: transparent;
  transition: all 0.3s ease;
}

#pageUp:hover {
  color: rgba(255, 255, 255, 1) !important;
}
</style>

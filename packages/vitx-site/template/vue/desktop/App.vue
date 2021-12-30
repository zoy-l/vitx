<script setup>
import VitxSite from './built/index.vue'
</script>

<template>
  <vitx-site>
    <router-view />
  </vitx-site>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

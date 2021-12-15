<template>
  <built-header />
  <built-nav />
  <!-- <built-nav />

  <built-container>
    <built-content>
      <slot />
    </built-content>
  </built-container>-->
</template>

<script>
import BuiltHeader from './BuiltHeader.vue'
import BuiltNav from './BuiltNav.vue'

export default {
  components: {
    BuiltHeader,
    BuiltNav
  }
}
</script>

<style>
</style>

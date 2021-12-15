<script setup>
import BuiltContainer from './BuiltContainer.vue'
import BuiltHeader from './BuiltHeader.vue'
import BuiltNav from './BuiltNav.vue'
</script>

<template>
  <built-header />
  <built-nav />
  <built-container>
    <slot />
  </built-container>
</template>

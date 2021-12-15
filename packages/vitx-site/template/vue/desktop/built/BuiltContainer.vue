<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function onClick({ target }) {
  if (['H2', 'H3', 'H4', 'H5'].includes(target.tagName)) {
    scrollToAnchor(target)
  }
}

function scrollToAnchor(target) {
  if (target.id) {
    router.push({
      name: route.name,
      hash: '#' + target.id
    })
  }
}
</script>

<template>
  <main class="vitx-built-container">
    <div :class="['vitx-built-container__content']" @click="onClick">
      <slot />
    </div>
  </main>
</template>

<style lang="less">
.vitx-built-container {
  box-sizing: border-box;
  padding-left: var(--vitx-built-nav-width);
  overflow: hidden;

  &__content {
    position: relative;
  }
}
</style>

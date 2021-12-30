
<script setup>
import BuiltLogo from './BuiltLogo.vue';
</script>

<template>
  <header class="vitx-built-header">
    <a class="vitx-built-header__logo">
      <!-- <img src="config.logo" v-if="config" /> -->
      <!-- v-else -->
      <built-logo />
      <span>Vitx Site</span>
    </a>
  </header>
</template>

<style lang="less">
.vitx-built-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  height: var(--vitx-built-header-height);
  padding: 0 var(--vitx-built-padding);
  border-bottom: thin solid var(--vitx-built-border-color);
  background-color: var(--vitx-built-background-color);

  &__logo {
    display: block;

    img,
    span,
    svg {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }

    img,
    svg {
      width: 28px;
      margin-right: 12px;
    }

    span {
      color: var(--vitx-built-primary-color);
      font-size: 22px;
    }
  }
}
</style>

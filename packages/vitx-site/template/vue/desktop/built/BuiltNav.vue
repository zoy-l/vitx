<script setup>
import { reactive, computed } from 'vue'

const navConfig = reactive([
  {
    title: '开发指南',
    items: [
      {
        path: 'home',
        title: '介绍'
      }
    ]
  }
])

const itemName = computed(() => (item) => {
  const name = (item.title || item.name).split(' ')
  return `${name[0]} <span>${name.slice(1).join(' ')}</span>`
})
</script>

<template>
  <nav class="vitx-built-nav">
    <div v-for="(group, index) in navConfig" :key="index">
      <div class="vitx-built-nav__title">{{ group.title }}</div>

      <template v-if="group.items">
        <div
          v-for="(item, groupIndex) in group.items"
          :key="groupIndex"
          class="vitx-built-nav__item"
        >
          <router-link v-if="item.path" :to="'path'" v-html="itemName(item)" />
          <a v-else-if="item.link" :href="item.link" v-html="itemName(item)" />
          <a v-else v-html="itemName(item)" />
        </div>
      </template>
    </div>
  </nav>
</template>

<style lang="less">
.vitx-built-nav {
  position: fixed;
  width: var(--vitx-built-nav-width);
  z-index: 1;
  left: 0;
  top: var(--vitx-built-header-height);
  bottom: 0;
  height: 100%;
  overflow-y: scroll;
  padding: 10px;
  box-sizing: border-box;
  border-right: thin solid var(--vitx-built-border-color);

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(69, 90, 100, 0.2);
  }

  &__title {
    padding: 8px 0 8px var(--vitx-built-padding);
    color: #7f8e9d;
    font-weight: 600;
    font-size: 15px;
    line-height: 28px;
  }

  &__item {
    a {
      display: block;
      margin: 8px 0;
      padding: 8px 0 8px var(--vitx-built-padding);
      color: #46505a;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      transition: color 0.2s, background-color 0.2s;

      &:hover,
      &.active {
        color: #20262d;
        background-color: rgb(243, 246, 249);
        border-radius: 6px;
      }

      &.active {
        font-weight: 600;
        background-color: #ebfff0;
        border-radius: 999px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}
</style>

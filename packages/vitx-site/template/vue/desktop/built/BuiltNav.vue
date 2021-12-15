<script setup>
import { reactive, computed } from 'vue'

const navConfig = reactive([
  {
    title: '开发指南',
    items: [
      {
        path: 'home',
        title: '介绍',
      },
    ],
  }
])

const itemName = computed(() => (item) => {
  const name = (item.title || item.name).split(' ');
  return `${name[0]} <span>${name.slice(1).join(' ')}</span>`;
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
  width: 250px;
  left: 0;
  z-index: 1;
  overflow-y: scroll;
  height: 100%;
  border-right: thin solid var(--vitx-built-border-color);

  &__title {
    padding: 8px 0 8px var(--vitx-built-padding);
    color: #455a64;
    font-weight: 600;
    font-size: 15px;
    line-height: 28px;
  }

  &__item {
    a {
      display: block;
      margin: 8px 0;
      padding: 8px 0 8px var(--vitx-built-padding);
      color: #455a64;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      transition: color 0.2s, background-color 0.2s;

      &:hover,
      &.active {
        color: #20262d;
        background-color: #f3f6f9;
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

import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  }
})

export default router

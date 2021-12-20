import { createRouter, createWebHashHistory } from 'vue-router'

function installRouters() {
  const routes = []

  routes.push({
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'home'
    }
  })
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: installRouters(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  }
})

export default router

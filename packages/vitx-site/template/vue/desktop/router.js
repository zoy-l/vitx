import { createRouter, createWebHashHistory } from 'vue-router'
import documents from '@vitx-documents'

function installRouters() {
  /** @type {{path:string, name:string}[]} */
  const docs = documents
  const routes = []

  const document = Object.keys(docs)

  routes.push({
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'home'
    }
  })

  document.forEach((name) => {
    routes.push({
      name: `${name}`,
      path: `/${name}`,
      component: docs[name],
      meta: {
        name
      }
    })
  })

  return routes
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

/**
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 */

import { createRouter, createWebHistory } from 'vue-router'
import documents from '@vitx-documents-mobile'
import 'vitx-site-common/styles/mobile'
import { createApp } from 'vue'

function installRouters() {
  /** @type {{path:string, name:string}[]} */
  const docs = documents
  /** @type {RouteRecordRaw[]} */
  const routes = []

  const document = Object.keys(docs)

  routes.push({
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: { name: 'BuiltMobileHome' }
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

const routers = createRouter({
  history: createWebHistory(),
  routes: installRouters(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  }
})

function App() {
  return <router-view />
}

createApp(App).use(routers).mount('#vitx-app')

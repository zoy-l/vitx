import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { documents, config, routes } from '@vitx-documents-desktop'
import BuiltSite from 'vitx-site-common/element'
import 'vitx-site-common/styles'
import { createApp } from 'vue'

function BuiltSiteView() {
  return (
    <BuiltSite config={config}>
      <router-view />
    </BuiltSite>
  )
}

function installRouters() {
  const doc = {
    ...documents,
    BuiltSite: BuiltSiteView
  }

  return routes.map((route) => {
    route.component = doc[route.component]

    if (route.children) {
      route.children = route.children.map((child) => {
        return {
          ...child,
          component: doc[child.component]
        }
      })
    }

    return route
  })
}

const routers = createRouter({
  history: createWebHistory(),
  routes: installRouters()
})

createApp(RouterView).use(routers).mount('#vitx-app')

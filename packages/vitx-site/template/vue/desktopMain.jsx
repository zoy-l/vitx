import { documents, config, documentsDetails, utils } from '@vitx-documents-desktop'
import { createRouter, createWebHistory } from 'vue-router'
import BuiltSite from 'vitx-site-common/element'
import 'vitx-site-common/styles'
import { createApp } from 'vue'

function Components() {
  return (
    <BuiltSite config={config}>
      <router-view />
    </BuiltSite>
  )
}

function installRouters() {
  /** @type {{path:string, name:string}[]} */
  const docs = documents
  const routes = []
  const { locales } = config.site
  const { parseName } = utils

  const componentsRoute = {
    path: '/components',
    component: Components,
    children: []
  }

  routes.push({
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'home'
    }
  })

  if (locales) {
    documentsDetails.forEach(({ name, isComponent }) => {
      const { component, lang } = parseName(name)

      if (isComponent) {
        componentsRoute.children.push({
          name,
          path: `${lang}/${component}`,
          component: docs[name],
          meta: { lang, name: component }
        })
      } else {
        routes.push({
          name,
          path: `/${lang}/${component}`,
          component: docs[name],
          meta: {
            lang,
            name: component
          }
        })
      }
    })
  } else {
    documentsDetails.forEach(({ name, isComponent }) => {
      if (isComponent) {
        componentsRoute.children.push({
          name,
          path: name,
          component: docs[name],
          meta: { name }
        })
      } else {
        routes.push({
          name: `${name}`,
          path: `/${name}`,
          component: docs[name],
          meta: {
            name
          }
        })
      }
    })
  }

  routes.push(componentsRoute)

  return routes
}

const routers = createRouter({
  history: createWebHistory(),
  routes: installRouters()
})

function App() {
  return <router-view />
}

createApp(App).use(routers).mount('#vitx-app')

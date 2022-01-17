import { documentsDetails, config, documents, utils } from '@vitx-documents-desktop'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import React, { Suspense, Fragment } from 'react'
import BuiltSite from 'vitx-site-common/element'
import { render } from 'react-dom'
import 'vitx-site-common/styles'

function App() {
  const {
    site: { lazy: isLazy, defaultLang }
  } = config
  const { parseName } = utils

  const otherRoute = []
  const componentsRoute = []
  const meta = {}

  const RootElement = isLazy ? Suspense : Fragment
  const RootElementProps = isLazy ? { fallback: <Fragment /> } : {}

  let homePath = ''

  documentsDetails.forEach((item) => {
    const { component, lang } = parseName(item.name)
    const Element = documents[item.name]

    if (component === 'home' && lang === defaultLang) {
      homePath = `/${lang}/${component}`
    }

    if (item.isComponent) {
      meta[`/components/${lang}/${component}`] = lang
      componentsRoute.push(<Route key={name} path={`${lang}/${component}`} element={<Element />} />)
    } else {
      otherRoute.push(
        <Route key={item.name} path={`/${lang}/${component}`} element={<Element />} />
      )
    }
  })

  return (
    <RootElement {...RootElementProps}>
      <BrowserRouter>
        <Routes>
          {otherRoute}
          <Route
            path="/components"
            element={<BuiltSite config={config} key="builsite" meta={meta} />}
          >
            {componentsRoute}
          </Route>
          <Route path="*" element={<Navigate to={homePath} replace />} />
        </Routes>
      </BrowserRouter>
    </RootElement>
  )
}

render(<App />, document.getElementById('vitx-app'))

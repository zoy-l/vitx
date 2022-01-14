import { useRouter, useProps, useState } from '@vitx-documents-common'
import { useRoute } from 'vue-router'

export default function BuiltAside(props) {
  const {
    attrs: { config }
  } = useProps(props)
  const { nav, locales } = config.site
  const route = useRoute()
  const { lang } = route.meta

  const asides = nav || locales[lang]

  const router = useRouter()
  const [value, setValue] = useState({
    activePath: location.pathname
  })

  const onRouter = (path) => () => {
    setValue({ activePath: '/components/' + path })
    router(path)
  }

  return (
    <aside className="vitx-built-nav" id="vitx-built-nav">
      {asides.map((group, index) => {
        let links = null

        if (group.items) {
          links = group.items.map((item, groupIndex) => {
            return (
              <div
                key={groupIndex}
                className="vitx-built-nav__item"
                active={`${`/components/${item.path}` === value.activePath}`}
              >
                <span onClick={onRouter(item.path)}>{item.title}</span>
              </div>
            )
          })
        }

        return (
          <div key={index}>
            <div className="vitx-built-nav__title">{group.title}</div>
            {links}
          </div>
        )
      })}
    </aside>
  )
}

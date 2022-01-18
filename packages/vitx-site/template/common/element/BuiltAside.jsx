import { useRouter, useProps, useState } from '@vitx-documents-common'

export default function BuiltAside(props) {
  const { attrs, lang } = useProps(props)
  const { nav } = attrs.config.components
  const asides = Array.isArray(nav) ? nav : nav[lang]

  const router = useRouter()
  const [value, setValue] = useState({
    activePath: location.pathname
  })

  const basePath = lang ? `/components/${lang}/` : '/components/'

  const onRouter = (path) => () => {
    setValue({ activePath: basePath + path })
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

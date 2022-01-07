import { useRouter } from '@vitx-documents-common-router'

export default function BuiltAside(props) {
  const { nav } = props

  const router = useRouter()

  const onRouter = (path) => () => {
    router(path)
  }

  return (
    <aside className="vitx-built-nav" id="vitx-built-nav">
      {nav.map((group, index) => {
        let links = null

        if (group.items) {
          links = group.items.map((item, groupIndex) => {
            return (
              <div key={groupIndex} className="vitx-built-nav__item">
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

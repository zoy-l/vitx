export default function BuiltAside(props) {
  const { nav } = props

  return (
    <aside className="vitx-built-nav">
      {nav.map((group, index) => {
        let links = null

        if (group.items) {
          links = group.items.map((item, groupIndex) => {
            return (
              <div key={groupIndex} className="vitx-built-nav__item">
                <a href={item.link}>{item.title}</a>
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

import { config } from '@vitx-documents-desktop'

function BuiltMobileHome() {
  const {
    site: { nav }
  } = config
  return (
    <aside className="vitx-built-mobile-home">
      {nav.map((group, index) => {
        let links = null

        if (group.items) {
          links = group.items.map((item, groupIndex) => {
            return (
              <div key={groupIndex} className="vitx-built-mobile-home__item">
                <a href={item.link}>{item.title}</a>
                <svg viewBox="0 0 1024 1024">
                  <path
                    fill="#B6C3D2"
                    d="M601.1 556.5L333.8 289.3c-24.5-24.5-24.5-64.6 0-89.1s64.6-24.5 89.1 0l267.3 267.3c24.5 24.5 24.5 64.6 0 89.1-24.5 24.4-64.6 24.4-89.1-.1z"
                  ></path>
                  <path
                    fill="#B6C3D2"
                    d="M690.2 556.5L422.9 823.8c-24.5 24.5-64.6 24.5-89.1 0s-24.5-64.6 0-89.1l267.3-267.3c24.5-24.5 64.6-24.5 89.1 0 24.5 24.6 24.5 64.6 0 89.1z"
                  ></path>
                </svg>
              </div>
            )
          })
        }

        return (
          <div key={index}>
            <div className="vitx-built-mobile-home__title">{group.title}</div>
            {links}
          </div>
        )
      })}
    </aside>
  )
}

BuiltMobileHome.displayName = 'BuiltMobileHome'
export default BuiltMobileHome

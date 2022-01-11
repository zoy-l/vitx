import { useProps } from '@vitx-documents-common'
import BuiltContainer from './BuiltContainer'
import BuiltHeader from './BuiltHeader'
import BuiltAside from './BuiltAside'

export default function BuiltSite(props) {
  const {
    attrs: { config },
    children
  } = useProps(props)
  const {
    site: { nav, simulator }
  } = config

  return (
    <div>
      <BuiltHeader />
      <main className="vitx-built-main">
        <BuiltAside nav={nav} />
        <BuiltContainer simulator={simulator}>{children()}</BuiltContainer>
      </main>
    </div>
  )
}

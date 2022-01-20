import { useProps } from '@vitx-documents-common'
import BuiltContainer from './BuiltContainer'
import BuiltHeader from './BuiltHeader'
import BuiltAside from './BuiltAside'

export default function BuiltSite(props) {
  const {
    attrs: { config },
    children,
    lang
  } = useProps(props)

  const {
    components: { simulator }
  } = config

  window.lang = lang

  return (
    <div>
      <BuiltHeader />
      <main className="vitx-built-main">
        <BuiltAside config={config} lang={lang} />
        <BuiltContainer simulator={simulator}>{children()}</BuiltContainer>
      </main>
    </div>
  )
}

import BuiltContainer from './BuiltContainer'
import BuiltHeader from './BuiltHeader'
import BuiltAside from './BuiltAside'

export default function BuiltSite(props, { slots }) {
  const { children = slots.default?.(), nav } = props

  return (
    <div>
      <BuiltHeader />
      <BuiltAside nav={nav} />
      <BuiltContainer>{children}</BuiltContainer>
    </div>
  )
}

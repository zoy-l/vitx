import BuiltContainer from './BuiltContainer'
import BuiltHeader from './BuiltHeader'
import BuiltAside from './BuiltAside'

export default function BuiltSite(props, { slots }) {
  const { children = slots.default?.() } = props
  return (
    <div>
      <BuiltHeader />
      <BuiltAside />
      <BuiltContainer>{children}</BuiltContainer>
    </div>
  )
}

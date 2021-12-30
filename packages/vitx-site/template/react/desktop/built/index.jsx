import BuiltContainer from './BuiltContainer'
import BuiltHeader from './BuiltHeader'
import BuiltNav from './BuiltNav'

export default function BuiltSite(props) {
  const { children } = props
  return (
    <div>
      <BuiltHeader />
      <BuiltNav />
      <BuiltContainer>{children}</BuiltContainer>
    </div>
  )
}

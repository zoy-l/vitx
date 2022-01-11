import { useProps } from '@vitx-documents-common'

import BuiltSimulator from './BuiltSimulator'

export default function BuiltContainer(props) {
  const {
    attrs: { simulator },
    children
  } = useProps(props, true)

  return (
    <main className="vitx-built-container">
      <div className="vitx-built-container__content" simulator={`${simulator}`}>
        {children()}
      </div>
      {simulator && <BuiltSimulator />}
    </main>
  )
}

import BuiltSimulator from './BuiltSimulator'

export default function BuiltContainer(props, { slots }) {
  const { children = slots.default?.(), simulator } = props

  return (
    <main className="vitx-built-container">
      <div className="vitx-built-container__content" simulator={`${simulator}`}>
        {children}
      </div>
      {simulator && <BuiltSimulator />}
    </main>
  )
}

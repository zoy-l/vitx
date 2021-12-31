import BuiltSimulator from './BuiltSimulator'

export default function BuiltContainer(props, { slots }) {
  const { children = slots.default?.() } = props

  return (
    <main className="vitx-built-container">
      <div className="vitx-built-container__content">{children}</div>
      <BuiltSimulator />
    </main>
  )
}

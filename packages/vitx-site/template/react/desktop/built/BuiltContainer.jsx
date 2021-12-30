export default function BuiltContainer(props) {
  const { children } = props
  return (
    <main className="vitx-built-container">
      <div className="vitx-built-container__content">{children}</div>
    </main>
  )
}

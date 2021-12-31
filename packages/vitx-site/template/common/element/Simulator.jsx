export default function Simulator(props, { slots }) {
  const { children = slots.default?.() } = props

  return (
    <div className="vitx-built-device">
      <div className="vitx-built-device__frame">
        <div className="vitx-built-device__content">
          <div className="vitx-built-device__sensors">
            <div />
          </div>
          {children}
        </div>
      </div>
      <div className="vitx-built-device__stripe" />

      <div className="vitx-built-device__action">
        <div />
        <div />
      </div>
      <div className="vitx-built-device__power" />
    </div>
  )
}

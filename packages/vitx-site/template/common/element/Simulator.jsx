function Sensor() {
  return (
    <svg viewBox="0 0 1024 1024" width="8" height="8">
      <path d="M64 900v0.2C195.8 824 348.8 780.3 512 780.3s316.2 43.6 448 119.9v-0.2c0-331.6-180.2-621.2-448-776.1C244.2 278.8 64 568.3 64 900z" />
    </svg>
  )
}

export default function Simulator(props, { slots }) {
  const { children = slots.default?.() } = props

  return (
    <div className="vitx-built-device">
      <div className="vitx-built-device__frame">
        <div className="vitx-built-device__content">
          <div className="vitx-built-device__sensors">
            <div />
            <Sensor />
            <Sensor />
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

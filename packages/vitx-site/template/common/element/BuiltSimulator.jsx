import Simulator from './Simulator'

export default function BuiltSimulator() {
  return (
    <div className="vitx-built-simulator">
      <Simulator>
        <iframe src="http://localhost:3000/mobile.html" frameBorder="0" />
      </Simulator>
    </div>
  )
}

import { useState } from 'react'

function Counter() {
  const [counter, setCounter] = useState(0)

  return (
    <div className="counter">
      <div>Counter: {counter}</div>
      <button onClick={() => setCounter(counter + 1)}>Inc</button>
      <button onClick={() => setCounter(counter - 1)}>Dec</button>
    </div>
  )
}

export default Counter

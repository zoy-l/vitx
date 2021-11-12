import { useState } from 'react'

function Foo() {
  const [state, setstate] = useState('hello vitx!')

  return <div>{state}</div>
}

export default Foo

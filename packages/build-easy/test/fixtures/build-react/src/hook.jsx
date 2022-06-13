import { useState } from 'react'

function Foo() {
  const [state, setstate] = useState('hello build-easy!')

  return <div>{state}</div>
}

export default Foo

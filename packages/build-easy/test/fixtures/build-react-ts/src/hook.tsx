import React, { useState } from 'react'

function Foo() {
  const [state] = useState<string>('hello build-easy!')

  return <div>{state}</div>
}

export default Foo

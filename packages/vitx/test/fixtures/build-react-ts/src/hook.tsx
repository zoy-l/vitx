import React, { useState } from 'react'

function Foo() {
  const [state] = useState<string>('hello vitx!')

  return <div>{state}</div>
}

export default Foo

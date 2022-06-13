/*__build-easy__jsx__file__*/
import { useState } from 'react';

function Foo() {
  var _useState = useState('hello build-easy!'),
      state = _useState[0],
      setstate = _useState[1];

  return /*#__PURE__*/React.createElement("div", null, state);
}

export default Foo;
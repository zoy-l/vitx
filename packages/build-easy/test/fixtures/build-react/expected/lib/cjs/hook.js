"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = require("react");

/*__build-easy__jsx__file__*/
function Foo() {
  var _useState = (0, _react.useState)('hello build-easy!'),
      state = _useState[0],
      setstate = _useState[1];

  return /*#__PURE__*/React.createElement("div", null, state);
}

var _default = Foo;
exports.default = _default;
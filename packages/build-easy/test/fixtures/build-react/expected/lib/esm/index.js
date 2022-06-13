function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*__vitx__jsx__file__*/
import React from 'react';

var Com = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Com, _React$Component);

  function Com(props) {
    return _React$Component.call(this, props) || this;
  }

  var _proto = Com.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", null, "hello build-easy!");
  };

  return Com;
}(React.Component);

export { Com as default };
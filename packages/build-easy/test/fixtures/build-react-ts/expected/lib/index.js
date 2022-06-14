"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Com = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Com, _React$Component);

  function Com(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = void 0;
    _this.state = {};
    return _this;
  }

  var _proto = Com.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/_react.default.createElement("div", null, "hello build-easy!");
  };

  return Com;
}(_react.default.Component);

exports.default = Com;
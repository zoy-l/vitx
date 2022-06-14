"use strict";

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;
/*__build-easy__jsx__file__*/

var react_1 = __importDefault(require("react"));

var Com =
/** @class */
function (_super) {
  __extends(Com, _super);

  function Com(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {};
    return _this;
  }

  Com.prototype.render = function () {
    return react_1["default"].createElement("div", null, "hello build-easy!");
  };

  return Com;
}(react_1["default"].Component);

exports["default"] = Com;
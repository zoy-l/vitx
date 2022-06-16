"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

function __vue_render__(_ctx, _cache) {
  return (0, _vue.openBlock)(), (0, _vue.createElementBlock)("div", null, (0, _vue.toDisplayString)(_ctx.msg), 1
  /* TEXT */
  );
}

var __vue_sfc__ = {
  data: function data() {
    return {
      msg: 'hello build-easy!'
    };
  }
};
__vue_sfc__.render = __vue_render__;
__vue_sfc__.__file = 'index.vue';
var _default = __vue_sfc__;
exports.default = _default;
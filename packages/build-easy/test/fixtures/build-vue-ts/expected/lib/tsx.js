"use strict";

import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
exports.__esModule = true;
/*__vitx__jsx__file__*/

exports["default"] = {
  data: function data() {
    return {
      msg: 123
    };
  },
  methods: {
    onPrintf: function onPrintf(msg) {
      console.log(msg, this.msg);
    }
  },
  render: function render() {
    return _createVNode("div", null, [_createTextVNode("hello build-easy!")]);
  }
};
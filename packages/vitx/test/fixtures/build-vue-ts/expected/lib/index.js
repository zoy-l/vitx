"use strict";

exports.__esModule = true;

var vue_1 = require("vue");

var __vue_sfc__ = (0, vue_1.defineComponent)({
  data: function data() {
    return {
      msg: 'hello vitx!'
    };
  },
  methods: {
    onPrintf: function onPrintf(msg) {
      console.log(msg);
    }
  }
});

__vue_sfc__.__file = 'index.vue';
exports["default"] = __vue_sfc__;
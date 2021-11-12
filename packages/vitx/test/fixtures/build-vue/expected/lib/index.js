import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";

function __vue_render__(_ctx, _cache) {
  return _openBlock(), _createElementBlock("div", null, _toDisplayString(_ctx.msg), 1
  /* TEXT */
  );
}

var __vue_sfc__ = {
  data: function data() {
    return {
      msg: 'hello vitx!'
    };
  }
};
__vue_sfc__.render = __vue_render__;
__vue_sfc__.__file = 'index.vue';
export default __vue_sfc__;
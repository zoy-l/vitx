import { unref as _unref, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
import { onMounted, reactive } from 'vue';
var __vue_sfc__ = {
  setup: function setup(__props) {
    onMounted(function () {
      console.log('hello vitx!');
    });
    var count = ref(0);
    var obj = reactive({
      count: count
    });
    return function (_ctx, _cache) {
      return _openBlock(), _createElementBlock("section", null, _toDisplayString(_unref(obj)), 1
      /* TEXT */
      );
    };
  }
};
__vue_sfc__.__file = 'index.vue';
export default __vue_sfc__;
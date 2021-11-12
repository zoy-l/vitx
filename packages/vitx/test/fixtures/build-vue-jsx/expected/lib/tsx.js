import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";

/*__vitx__jsx__file__*/
import { defineComponent } from 'vue';
export default defineComponent({
  data: function data() {},
  methods: {
    onPrintf: function onPrintf(msg) {
      console.log(msg);
    }
  },
  render: function render() {
    return _createVNode("div", null, [_createTextVNode("hello vitx!")]);
  }
});
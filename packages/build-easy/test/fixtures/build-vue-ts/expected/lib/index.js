import { defineComponent } from 'vue';

var __vue_sfc__ = defineComponent({
  data: function data() {
    return {
      msg: 'hello build-easy!'
    };
  },
  methods: {
    onPrintf: function onPrintf(msg) {
      console.log(msg);
    }
  }
});

__vue_sfc__.__file = 'index.vue';
export default __vue_sfc__;
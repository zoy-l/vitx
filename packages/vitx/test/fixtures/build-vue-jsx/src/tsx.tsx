import { defineComponent } from 'vue'

export default defineComponent({
  data() {},
  methods: {
    onPrintf(msg: string) {
      console.log(msg)
    }
  },
  render() {
    return <div>hello vitx!</div>
  }
})

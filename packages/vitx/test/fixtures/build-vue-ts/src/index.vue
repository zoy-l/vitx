<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      msg: 'hello vitx!'
    }
  },
  methods: {
    onPrintf(msg: string) {
      console.log(msg)
    }
  }
})
</script>

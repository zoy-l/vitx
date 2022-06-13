<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      msg: 'hello build-easy!'
    }
  },
  methods: {
    onPrintf(msg: string) {
      console.log(msg)
    }
  }
})
</script>

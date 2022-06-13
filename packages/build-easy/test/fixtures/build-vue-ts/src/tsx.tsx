export default {
  data() {
    return {
      msg: 123
    }
  },
  methods: {
    onPrintf(msg: string) {
      console.log(msg, this.msg)
    }
  },
  render() {
    return <div>hello build-easy!</div>
  }
}

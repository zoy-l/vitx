export default {
  moduleType: 'esm',
  target: 'browser',
  afterReadWriteStream({ through }) {
    return through.obj()
  },
  beforeReadWriteStream({ through }) {
    return through.obj()
  },
  mountedReadWriteStream({ through }) {
    return through.obj()
  }
}

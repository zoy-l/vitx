export default {
  moduleType: 'esm',
  target: 'browser',
  beforeReadWriteStream({ through }) {
    return through.obj()
  }
}

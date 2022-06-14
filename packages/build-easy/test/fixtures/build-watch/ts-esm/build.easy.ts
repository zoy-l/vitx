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
  },
  afterHook() {
    console.log('afterHook')
  },
  mapSources(sourcesMap: (arg0: (path: any) => any) => any) {
    return sourcesMap((path: any) => {
      return path
    })
  },
  tsCompilerOptions: {
    declaration: true
  }
}

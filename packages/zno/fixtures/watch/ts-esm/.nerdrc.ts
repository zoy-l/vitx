import { IConfig } from '../../../src'

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
  mapSources(sourcesMap) {
    return sourcesMap((path) => {
      return path
    })
  }
} as IConfig

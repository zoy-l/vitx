import pr from 'prettier'
import path from 'path'

export default {
  frame: 'vue',
  tsCompilerOptions: {
    jsx: 'preserve',
    declaration: true,
    skipLibCheck: true,
    module: 'ES2015',
    target: 'esnext',
    moduleResolution: 'node'
  }
}

import path from 'path'
const root = path.join(__dirname, './src')

export default {
  moduleType: 'esm',
  target: 'browser',
  alias: {
    '@': root,
    '@hello': path.join(root, 'hello'),
    '@utils': path.join(root, 'utils')
  }
}

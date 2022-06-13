import { BuildConfig } from 'build-easy'
// import pr from 'prettier'

export default <BuildConfig>{
  frame: 'vue'
  // afterReadWriteStream({ through }) {
  //   return through.obj((file, _, cb) => {
  //     file.contents = pr.format(file.contents.toString(), { parser: 'babel' })

  //     cb(null, file)
  //   })
  // }
}

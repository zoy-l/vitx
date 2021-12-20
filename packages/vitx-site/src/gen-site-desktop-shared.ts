// import { readdirSync } from 'fs-extra'
// import { join, parse } from 'path'
// import glob from 'fast-glob'

// import { siteEntryDir } from './constants'

// export default function genSiteDesktopShared() {
//   const entryDirs = readdirSync(siteEntryDir)

//   glob.sync(join(siteEntryDir, '**/*.md')).map((path) => {
//     const pairs = parse(path).name.split('.')
//     return {
//       name: pairs[0] + pairs[1],
//       path
//     }
//   })
// }

export {}

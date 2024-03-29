// The main part comes from the link below, with appropriate modifications
// https://github.com/CryUshio/gulp-path-alias#readme

import slash from '@vitx/bundles/model/slash'
import path from 'path'

const suffixPatten = `\\/|['"]|\\s*\\)`
const prefixPattenMap = {
  js: `import\\s*[^'"]*\\(?|from|require\\s*\\(`,
  xml: `src=|url=|poster=|href=`, // poster: wxml
  css: `@import\\s*|url\\s*\\(`
}

function relative(from: string, to: string) {
  const relativePath = slash(path.relative(from, to))

  if (!relativePath) {
    return '.'
  }

  return !/^\./.test(relativePath) ? `./${relativePath}` : relativePath
}

function getRegExp(prefixPatten: string): (name: string) => RegExp {
  return function (aliasName) {
    return new RegExp(`(?:(${prefixPatten})\\s*['"]?\\s*)${aliasName}(${suffixPatten})`, 'gm')
  }
}

export default function replaceAll(options: {
  ext: string
  contents: string
  dirname: string
  aliasMap: Record<string, string>
}) {
  const { ext, dirname, aliasMap } = options
  let { contents } = options

  let reg: (name: string) => RegExp
  switch (ext) {
    case '.js':
    case '.ts':
    case '.wxs':
      reg = getRegExp(prefixPattenMap.js)
      break
    case '.css':
    case '.less':
    case '.scss':
    case '.styl':
    case '.stylus':
    case '.wxss':
      reg = getRegExp(prefixPattenMap.css)
      break
    case '.html':
    case '.wxml':
      reg = getRegExp(prefixPattenMap.xml)
      break
    case '.jsx':
    case '.tsx':
    default:
      reg = getRegExp(
        Object.keys(prefixPattenMap)
          .map((k) => prefixPattenMap[k])
          .join('|')
      )
      break
  }

  Object.keys(aliasMap).forEach((alias) => {
    const regExp = reg(alias)
    const subReg = new RegExp(`${alias}(${suffixPatten})`)
    const replacer = `${relative(dirname, aliasMap[alias])}$1`

    contents = contents.replace(regExp, (match) => match.replace(subReg, replacer))
  })

  return contents
}

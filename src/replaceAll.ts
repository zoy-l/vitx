// The main part comes from the link below, with appropriate modifications
// https://github.com/CryUshio/gulp-path-alias#readme

import path from 'path'
import slash from 'slash'

type AliasMapType = Record<string, string>
type GetRegExpReturn = (name: string) => RegExp

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

function getRegExp(prefixPatten: string): GetRegExpReturn {
  return function (aliasName) {
    return new RegExp(
      `(?:(${prefixPatten})\\s*['"]?\\s*)${aliasName}(${suffixPatten})`,
      'gm'
    )
  }
}

export default function replaceAll(options: {
  ext: string
  contents: string
  dirname: string
  aliasMap: AliasMapType
}) {
  const { ext, dirname, aliasMap } = options
  let { contents } = options

  let reg: GetRegExpReturn
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
          .map((k) => prefixPattenMap[k as keyof typeof prefixPattenMap])
          .join('|')
      )
      break
  }

  Object.keys(aliasMap).forEach((alias) => {
    const regExp = reg(alias)
    const subReg = new RegExp(`${alias}(${suffixPatten})`)
    const replacer = `${relative(dirname, aliasMap[alias])}$1`

    contents = contents.replace(regExp, (match) =>
      match.replace(subReg, replacer)
    )
  })

  return contents
}

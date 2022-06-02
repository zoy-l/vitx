const { join } = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const figures = require('figures')
const prettier = require('prettier')

function getJestArgs() {
  const value = require(join(require.resolve('jest-cli'), '../cli/args'))

  Object.keys(value.options).forEach((key) => {
    delete value.options[key].description
    value.options[key].type = value.options[key].type || 'any'
  })

  const cwd = join(__dirname, './')

  const type = prettier
    .format(
      JSON.stringify(
        Object.keys(value.options).reduce((memo, current) => {
          memo[current] = value.options[current].type
          return memo
        }, {})
      ),
      { parser: 'json' }
    )
    .replace(/"/g, '')
    .replace(/array/g, 'any[]')

  fs.outputFileSync(
    join(cwd, 'jestArgs/index.js'),
    prettier.format(`module.exports = ${JSON.stringify(value.options)}`, {
      parser: 'babel',
      semi: false
    })
  )
  const { size } = fs.statSync(cwd)
  fs.outputFileSync(
    join(cwd, 'jestArgs/index.d.ts'),
    `declare const _default: ${type}\n  export default _default`
  )

  console.log(chalk.green(figures.tick + ' Success:'), chalk.yellow('jest-args'))

  return size
}

getJestArgs()

import yargsParser from 'yargs-parser'
import chalk from 'chalk'

import Build from './Build'

const args = yargsParser(process.argv.slice(2))

if (!args._[0] || args.w || args.watch) {
  const watch = args.w ?? args.watch
  const cwd = process.cwd()

  const build = new Build({ cwd, watch })

  build.step().then(() => null)
} else {
  throw new Error(chalk.red(`Unknown command '${args._}'`))
}

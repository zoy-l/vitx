import yargsParser from '@nerd/bundles/model/yargs-parser'
import chalk from '@nerd/bundles/model/chalk'

import Build from './Build'
import test from './test'

const args = yargsParser(process.argv.slice(2))
const commands = ['build', 'test']

function logError(err: any) {
  console.error(chalk.red(err))
  process.exit(1)
}

if (commands.includes(args._[0])) {
  const command = args._[0]

  if (command === 'build') {
    const watch = args.w ?? args.watch
    const cwd = process.cwd()
    const build = new Build({ cwd, watch })
    build.step().catch((err) => {
      logError(err)
    })
  } else if (command === 'test') {
    test(args).catch((err) => {
      logError(err)
    })
  } else {
    throw new Error(chalk.red(`Unknown command '${args._}'`))
  }
}

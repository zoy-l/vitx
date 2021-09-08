import yargsParser from '@zno/bundles/model/yargs-parser'
import chalk from '@zno/bundles/model/chalk'

import { build } from './Build'
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
    build({ cwd, watch }).catch((err) => {
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

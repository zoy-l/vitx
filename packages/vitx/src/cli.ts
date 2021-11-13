import yargsParser from '@vitx/bundles/model/yargs-parser'
import chalk from '@vitx/bundles/model/chalk'

import { build } from './compile'
import jestRun from './jestRun'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    watch: ['w']
  },
  boolean: ['coverage', 'watch', 'debug', 'e2e']
})
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
    build({ cwd, watch }).catch(logError)
  } else if (command === 'test') {
    jestRun(args).catch(logError)
  } else {
    throw new Error(chalk.red(`Unknown command '${command}'`))
  }
}

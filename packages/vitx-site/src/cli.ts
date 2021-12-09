import yargsParser from '@vitx/bundles/model/yargs-parser'
import chalk from '@vitx/bundles/model/chalk'

import { compiler } from '.'

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

  console.log(args)

  if (command === 'build') {
    const cwd = process.cwd()

    try {
      compiler(cwd)
    } catch (err) {
      logError(err)
    }
  } else {
    throw new Error(chalk.red(`Unknown command '${command}'`))
  }
}

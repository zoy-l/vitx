import yargsParser from '@vitx/bundles/model/yargs-parser'
import chalk from '@vitx/bundles/model/chalk'

import { build } from './compile'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    watch: ['w']
  }
})

function logError(err: any) {
  console.error(chalk.red(err))
  process.exit(1)
}

const watch = args.w ?? args.watch
const cwd = process.cwd()
build({ cwd, watch }).catch(logError)

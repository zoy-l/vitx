import yargsParser from 'yargs-parser'
import run from './jestRun'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    watch: ['w']
  }
})

run(args)

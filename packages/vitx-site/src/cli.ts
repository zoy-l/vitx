import { Command } from 'commander'

import { vitxSiteVersion, compiler } from '.'

const program = new Command()

program.version(`vitx-site ${vitxSiteVersion}`)

program
  .command('dev')
  .description('Run dev server')
  .option('--vue', 'Use the vue framework')
  .option('--react', 'Use the react framework')
  .action(compiler)

program.parse()

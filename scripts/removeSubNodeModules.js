const figures = require('figures')
const rmrf = require('rimraf')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

fs.readdirSync('./packages')
  .filter((dirName) => dirName[0] !== '.' && ['bundles', 'vitx'].includes(dirName))
  .forEach((dirName) => {
    const nodeModules = path.join(__dirname, '..', 'packages', dirName, 'node_modules')

    console.log(chalk.green(figures.tick), chalk.yellow('remove package node_modules:'), dirName)
    rmrf.sync(nodeModules)
  })

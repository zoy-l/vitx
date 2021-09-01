const ncc = require('@vercel/ncc')
const fs = require('fs')
const pkg = require('./package.json')

Object.keys(pkg.dependencies).forEach((name) => {
  if (/@types/.test(name)) {
    return
  }

  ncc(require.resolve(name), {}).then(({ code, assets }) => {
    fs.writeFileSync(`./deps/${name}.js`, code)
  })
})

// console.log()

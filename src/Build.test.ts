import { copy, renameSync, mkdirSync } from 'fs-extra'
import rimraf from 'rimraf'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import Nerd from './Build'

const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

const getPathActualed = (cwd: string) => path.join(cwd, 'actualed')

function assertBuildResult(cwd: string) {
  const actualDir = getPathActualed(cwd)
  const expectDir = path.join(cwd, 'expected')

  if (fs.existsSync(actualDir) && !fs.existsSync(expectDir)) {
    copy(actualDir, expectDir)
    return
  }

  const actualFiles = glob.sync('**/*', { cwd: actualDir, nodir: true })
  const expectFiles = glob.sync('**/*', { cwd: expectDir, nodir: true })

  expect(actualFiles.length).toEqual(expectFiles.length)

  actualFiles.forEach((file) => {
    const actualFile = fs.readFileSync(path.join(actualDir, file), 'utf-8')
    const expectFile = fs.readFileSync(path.join(expectDir, file), 'utf-8')

    expect(actualFile.trim()).toEqual(expectFile.trim())
  })
}

function moveEsLibToDist(cwd: string) {
  const absDirPath = path.join(cwd, 'lib')
  const absActualedPath = getPathActualed(cwd)
  if (fs.existsSync(absDirPath)) {
    mkdirSync(absActualedPath)
    renameSync(absDirPath, path.join(absActualedPath, 'lib'))
  }
}

describe('nerd build', () => {
  const root = path.join(__dirname, '../fixtures')
  const buildPath = path.join(root, 'build')
  const watch = path.join(root, 'watch')

  fs.readdirSync(buildPath).forEach((dir) => {
    const cwd = path.join(buildPath, dir)

    if (dir.charAt(0) !== '.') {
      it(dir, (done) => {
        process.chdir(cwd)
        rimraf.sync(getPathActualed(cwd))

        const build = new Nerd({ cwd })

        build
          .step()
          .then(() => {
            moveEsLibToDist(cwd)

            if (fs.existsSync(path.join(cwd, 'lerna.json'))) {
              mkdirSync(getPathActualed(cwd))
              const pkgs = fs.readdirSync(path.join(cwd, 'packages'))
              for (let pkg of pkgs) {
                const pkgPath = path.join(cwd, 'packages', pkg)
                if (fs.statSync(pkgPath).isDirectory()) {
                  moveEsLibToDist(pkgPath)
                  renameSync(
                    getPathActualed(pkgPath),
                    path.join(
                      cwd,
                      'actualed',
                      pkg.split('/').slice(-1).join('')
                    )
                  )
                }
              }
            }

            try {
              assertBuildResult(cwd)
              done()
            } catch (err) {
              done(err)
            }
          })
          .catch((err) => {
            done(err)
          })
      })
    }
  })

  const file = ['js', 'ts']
  fs.readdirSync(watch).forEach((dir, index) => {
    const cwd = path.join(watch, dir)

    if (dir.charAt(0) !== '.') {
      it(dir, async (done) => {
        process.chdir(cwd)
        rimraf.sync(getPathActualed(cwd))
        const build = new Nerd({ cwd, watch: true })

        await build.step()
        await wait()

        fs.writeFileSync(`${cwd}/src/foo.${file[index]}`, 'const a = 1')
        await wait()

        fs.writeFileSync(`${cwd}/src/foo.${file[index]}`, 'const a = 2')
        await wait()

        rimraf.sync(`${cwd}/src/foo.${file[index]}`)
        await wait()

        moveEsLibToDist(cwd)
        try {
          assertBuildResult(cwd)
          process.emit('SIGINT', 'SIGINT')

          done()
        } catch (err) {
          done(err)
        }
      })
    }
  })
})

describe('nerd javascript api', () => {
  const root = path.join(__dirname, '../fixtures')
  const jsApiPath = path.join(root, 'jsApi')

  fs.readdirSync(jsApiPath).forEach((dir) => {
    const cwd = path.join(jsApiPath, dir)

    if (dir.charAt(0) !== '.') {
      it(dir, async (done) => {
        process.chdir(cwd)
        rimraf.sync(getPathActualed(cwd))

        const build = new Nerd({
          userConfig: {
            moduleType: 'cjs',
            target: 'node'
          }
        })

        await build.step()

        moveEsLibToDist(cwd)
        try {
          assertBuildResult(cwd)

          done()
        } catch (err) {
          done(err)
        }
      })
    }
  })
})

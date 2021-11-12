import { copy, renameSync, mkdirSync } from 'fs-extra'
import rimraf from 'rimraf'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import os from 'os'

import { isDefault } from '../src/utils'
import { build } from '../src/compile'

const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1500)
  })
jest.setTimeout(300000)

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

    expect(actualFile.trim().replace(/\r\n/g, '\n')).toEqual(
      expectFile.trim().replace(/\r\n/g, '\n')
    )
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

export const configFileNames = <const>['.vitxrc.ts', '.vitxrc.js']
const extras = ['config-error', 'build-watch', 'build-vue-css-scoped']
describe('vitx build', () => {
  const root = path.join(__dirname, './fixtures')

  if (os.type() === 'Windows_NT') {
    extras.push('build-react-ts')
  }

  console.warn(extras)

  fs.readdirSync(root)
    .filter((dir) => !extras.includes(dir) && dir.charAt(0) !== '.')
    .forEach((dir) => {
      const cwd = path.join(root, dir)

      it(dir, (done) => {
        process.chdir(cwd)
        rimraf.sync(getPathActualed(cwd))

        build({ cwd })
          .then(() => {
            moveEsLibToDist(cwd)

            const configFile = configFileNames.map((configName) => path.join(cwd, configName))
            const userConfig = configFile.find((configPath) => fs.existsSync(configPath))
            const config = isDefault(require(userConfig))

            if (config.packages) {
              mkdirSync(getPathActualed(cwd))
              const pkgs = fs.readdirSync(path.join(cwd, 'packages'))
              for (const pkg of pkgs) {
                const pkgPath = path.join(cwd, 'packages', pkg)
                if (fs.statSync(pkgPath).isDirectory()) {
                  moveEsLibToDist(pkgPath)
                  renameSync(
                    getPathActualed(pkgPath),
                    path.join(cwd, 'actualed', pkg.split('/').slice(-1).join(''))
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
    })

  const rootWatch = path.join(__dirname, './fixtures/build-watch')
  const file = ['js', 'ts']

  fs.readdirSync(rootWatch).forEach((dir, index) => {
    const cwd = path.join(rootWatch, dir)

    if (dir.charAt(0) !== '.') {
      it(dir, async () => {
        process.chdir(cwd)
        rimraf.sync(getPathActualed(cwd))

        await build({ cwd, watch: true })
        await wait()

        fs.writeFileSync(`${cwd}/src/foo.${file[index]}`, 'const a = 1')
        await wait()

        fs.writeFileSync(`${cwd}/src/foo.${file[index]}`, 'const a = 2')
        await wait()

        rimraf.sync(`${cwd}/src/foo.${file[index]}`)
        await wait()

        moveEsLibToDist(cwd)

        assertBuildResult(cwd)
        process.emit('SIGINT', 'SIGINT')
      })
    }
  })

  test('config error', async () => {
    const root = path.join(__dirname, './fixtures')
    const errorConfig = path.join(root, 'config-error')

    rimraf.sync(getPathActualed(errorConfig))

    await expect(build({ cwd: errorConfig })).rejects.toThrow(
      'Invalid options in "moduleType" must be one of [esm, cjs, all]'
    )
  })

  test('vue scoped', async () => {
    const root = path.join(__dirname, './fixtures')
    const cwd = path.join(root, 'build-vue-css-scoped')

    await build({ cwd })

    const vueSFC = isDefault(require(path.join(cwd, '/lib')))
    expect(vueSFC.__scopeId).toMatch(/data-v-\d+/)
  })
})

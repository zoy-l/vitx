import { copy, renameSync, mkdirSync } from 'fs-extra'
import rimraf from 'rimraf'
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import Nerd from './Build'

function assertBuildResult(cwd: string) {
  const actualDir = path.join(cwd, 'actualed')
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
  const absActualedPath = path.join(cwd, 'actualed')
  if (fs.existsSync(absDirPath)) {
    mkdirSync(absActualedPath)
    renameSync(absDirPath, path.join(absActualedPath, 'lib'))
  }
}

describe('nerd build', () => {
  const root = path.join(__dirname, '../__test__')

  fs.readdirSync(root).forEach((dir) => {
    const cwd = path.join(root, dir)

    if (dir.charAt(0) !== '.') {
      it(dir, (done) => {
        process.chdir(cwd)
        rimraf.sync(path.join(cwd, 'actualed'))

        const build = new Nerd({ cwd })

        build
          .step()
          .then(() => {
            moveEsLibToDist(cwd)
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
})

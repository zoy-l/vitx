# 🔨 vitx

简单的编译工具

[![lerna](https://img.shields.io/badge/support-lerna-blue)](https://lernajs.io/) [![GitHub license](https://img.shields.io/github/license/l-zoy/vitx)](https://github.com/l-zoy/vitx/blob/master/LICENSE) [![codecov](https://codecov.io/gh/l-zoy/vitx/branch/main/graph/badge.svg?token=W1ND9EDZEJ)](https://codecov.io/gh/l-zoy/vitx) [![<ORG_NAME>](https://circleci.com/gh/l-zoy/vitx.svg?style=svg)](https://app.circleci.com/pipelines/github/l-zoy/vitx)

## Features

- **支持** `typescript`
- **支持** 多目录`workspaces`编译
- **支持** `cjs` 和 `esm`
- **支持** 自定义 `stream` 扩展, 支持 `gulp` 插件
- **支持** `sourcemap`
- **支持** `小程序`编译
- **支持** `增量编译`
- **支持** 支持`vue` 和 `react` 文件编译
- **支持** 支持`less`编译
- **支持** 支持路径别名`alias`
- **支持** `jest`

## Installation

Install `vitx` via yarn or npm.

```bash
$ yarn add vitx
```

## Usage

```bash
# Bundle library
$ vitx build

# Watch dev
$ vitx build --watch
```

```bash

$ yarn add jest -D

# Bundle library
$ vitx test

```

注:

- 目录下添加 `jest.config.js` 或者 `jest.config.ts` 配置即可, 如果是 `node` 应用直接运行即可
- 默认配置可参考 [jest-config](https://github.com/l-zoy/vitx/blob/main/packages/vitx/src/jestConfig.ts)

修改或覆盖:

```typescript
import { IJestConfig } from 'vitx'

export default <IJestConfig>{
  // 如果是一个函数则会传入默认值最后返回新值
  // 如果是一个非函数值会进行直接覆盖
  collectCoverageFrom(memo) {
    return memo.concat([
      '!packages/vitx/src/jestConfig.ts',
      '!packages/vitx/src/cli.ts',
      '!packages/vitx/src/jestTransformer.ts',
      '!packages/vitx/src/jestRun.ts'
    ])
  }
}
```

## Config

新建 `.vitxrc.js` or `.vitxrc.ts` 文件进行配置。

```js
import { IConfig } from 'vitx'

export default {
  moduleType: 'cjs',
  target: 'node',
  alias: {
    '@': './src'
  }
} as IConfig
```

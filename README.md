# 🔨 vitx

简单的编译工具

[![lerna](https://img.shields.io/badge/support-lerna-blue)](https://lernajs.io/) [![GitHub license](https://img.shields.io/github/license/l-zoy/vitx)](https://github.com/l-zoy/vitx/blob/master/LICENSE) [![codecov](https://codecov.io/gh/l-zoy/vitx/branch/master/graph/badge.svg?token=W1ND9EDZEJ)](https://codecov.io/gh/l-zoy/vitx) [![<ORG_NAME>](https://circleci.com/gh/l-zoy/vitx.svg?style=svg)](https://app.circleci.com/pipelines/github/l-zoy/vitx)

## Features

- **支持** `typescript`
- **支持** 多目录编译
- **支持** `cjs` 和 `esm`
- **支持** 自定义 `stream` 扩展, 支持 `gulp` 插件
- **支持** `sourcemap`
- **支持** `小程序`编译
- **支持** `增量编译`
- **支持** 支持`vue` 和 `react` 文件编译
- **支持** 支持`less`编译
- **支持** 支持路径别名`alias`

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

### tsconfig.json

会自动读取 `tsconfig.json` 的 `compilerOptions` 的配置进行编译 `ts` or `tsx`

### Options

#### moduleType

输出格式,打包方式等

- Type: `"cjs" | "esm" | "all" `
- Default: `"esm"`

`all` 会同时输出 `cjs` 和 `esm` 的格式文件

#### extraBabelPresets

配置额外的 Babel presets。

- Type: `array`
- Default: `[]`

#### extraBabelPlugins

添加 Babel Plugins

- Type: `array`
- Default: `[]`

#### target

node 库 or browser 库，只作用于语法层。

- Type: `"node" | "browser"`
- Default: `"browser"`

`node`，兼容到 node@6 `browser`，兼容到 `['last 2 versions', 'IE 10']`

#### frame

支持`.vue`单文件编译及`vue jsx or tsx` (只支持 vue3) 支持`react jsx or tsx` 注意目前必须要指定框架

- Type: `"vue" | "react"`
- Default: ``

#### alias

路径别名, 参考 `webpack` alias 参数, 支持大部分主流文件类型, 支持小程序

- Type: `object`
- Default: `undefined`

```js
import path from 'path'
const root = path.join(__dirname, './src')

export default {
  alias: {
    '@': root,
    '@pkg': path.join(root, 'index'),
    '@utils': path.join(root, 'utils')
  }
}
```

#### browserFiles

target 为 `node` 时，配置例外文件走 `browser` target。

- Type: `[string]`
- Default: `[]`

注：所有 `.tsx` 和 `.jsx` 文件始终走 `browser` target。

#### nodeFiles

target 为 `browser` 时，配置例外文件走 `node` target。

- Type: `[string]`
- Default: `[]`

#### runtimeHelpers

是否把 helper 方法提取到 `@babel/runtime` 里。

- Type: `boolean`
- Default: `false`

注：

1. 配置了 `runtimeHelpers`，要在 dependencies 里安装 `@babel/runtime` 依赖
2. runtimeHelpers 只对 esm 有效

#### disableTypes

是否禁用类型检测, 将不会生成 d.ts

- Type: `boolean`
- Default: `false`

#### beforeReadWriteStream

编译中 hook, 在没有进行任何处理之前

- Type: `function`
- Default: `undefined`

注：

1. 会传入两个参数
   - `through2` https://github.com/rvagg/through2
   - `gulp-if` https://github.com/robrich/gulp-if,
2. 可以直接使用 `gulp` 插件

```js
export default {
  beforeReadWriteStream({ through, gulpIf }) {
    return through.obj((chunk, _, cb) => {
      cb(null, chunk)
    })

    return gulpLess()
  }
}
```

#### afterReadWriteStream

编译中 hook, 在进行编译处理之后

- Type: `function`
- Default: `undefined`

注：

1. 会传入两个参数,
   - `through2` https://github.com/rvagg/through2
   - `gulp-if` https://github.com/robrich/gulp-if,
2. 可以直接使用 `gulp` 插件

```js
export default {
  beforeReadWriteStream({ through, gulpIf }) {
    return through.obj((chunk, _, cb) => {
      cb(null, chunk)
    })
  }
}
```

#### packages

在多目录构建中，有可能出现组件间有构建先后的需求 `packages` 允许你自定义 packages 目录下的构建顺序, 当使用`packages`的时候没有在`packages`里面的目录不会进行编译

- Type: `string[]`
- Default: `[]`

```js
export default {
  packages: ['packagesA', 'packagesB']
}
```

注:

1. 子目录的配置文件会继承最外层的配置

#### entry

编译监听目录

- Type: `string`
- Default: `src`

#### output

编译输出目录

- Type: `string`
- Default: `lib`

#### sourcemap

- Type: `boolean`
- Default: `false`

基于 [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)

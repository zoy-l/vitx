# zmi-nerd

Simple transform tool

[![lerna](https://img.shields.io/badge/support-lerna-blue)](https://lernajs.io/)

## Features

- ✔︎ 支持 TypeScript
- ✔︎ 支持 lerna
- ✔︎ 支持 babel 或 esbuild 打包
- ✔︎ 支持 cjs 和 esm
- ✔︎ 支持自定义扩展

## Installation

Install `zmi-nerd` via yarn or npm.

```bash
$ yarn add zmi-nerd
```

## Usage

```bash
# Bundle library
$ nerd-build

# Watch dev
$ nerd-build --watch
```

## Config

新建 `.nerdrc.js` or `.nerdrc.ts` 文件进行配置。

```js
import { IConfig } from 'zmi-nerd'

export default {
  moduleType: 'cjs',
  target: 'node',
  paths: {
    '@': './src'
  }
} as IConfig
```

### Options

#### esBuild

是否以 esBuild 打包

- Type: `boolean`
- Default: `false`

#### moduleType

输出格式,打包方式等

- Type: `"cjs" | "esm"`
- Default: `"cjs"`

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
- Default: `"node"`

`node`，兼容到 node@6 `browser`，兼容到 `['last 2 versions', 'IE 10']`

#### react

支持 jsx or tsx

- Type: `boolean`
- Default: `false`

#### paths

路径别名, 参考 `webpack` alias 参数, 支持大部分主流文件类型, 支持小程序

- Type: `object`
- Default: `undefined`

```js
import path from 'path'
const root = path.join(__dirname, './src')

export default {
  paths: {
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

1. 会传入两个参数 `through2` `insert`,
2. 可以直接使用 `gulp` 插件

```js
export default {
  beforeReadWriteStream({ through, insert }) {
    return through.obj((chunk, _, cb) => {
      cb(null, chunk)
    })

    return insert.transform((content, file) => {
      return content
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

1. 会传入两个参数 `through2` `insert`,
2. 可以直接使用 `gulp` 插件

```js
export default {
  beforeReadWriteStream({ through, insert }) {
    return through.obj((chunk, _, cb) => {
      cb(null, chunk)
    })

    return insert.transform((content, file) => {
      return content
    })
  }
}
```

#### pkgs

在 lerna 构建中，有可能出现组件间有构建先后的需求 `pkgs` 允许你自定义 packages 目录下的构建顺序, 当使用`pkgs`的时候没有在`pkgs`里面的目录不会进行编译

- Type: `string[]`
- Default: `[]`

```js
export default {
  pkgs: ['packagesA', 'packagesB']
}
```

注:如果是 lerna 项目,没有传 `pkgs` 全部目录将进行编译

#### entry

编译监听目录

- Type: `string`
- Default: `src`

#### output

编译输出目录

- Type: `string`
- Default: `lib`

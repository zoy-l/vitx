"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _core() {
  const data = require("@nerd/bundles/model/@babel/core");

  _core = function _core() {
    return data;
  };

  return data;
}

function _gulpSourcemaps() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-sourcemaps"));

  _gulpSourcemaps = function _gulpSourcemaps() {
    return data;
  };

  return data;
}

function _gulpPlumber() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-plumber"));

  _gulpPlumber = function _gulpPlumber() {
    return data;
  };

  return data;
}

function _gulpTypescript() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-typescript"));

  _gulpTypescript = function _gulpTypescript() {
    return data;
  };

  return data;
}

function _deepmerge() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/deepmerge"));

  _deepmerge = function _deepmerge() {
    return data;
  };

  return data;
}

function _gulpInsert() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-insert"));

  _gulpInsert = function _gulpInsert() {
    return data;
  };

  return data;
}

function _chokidar() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/chokidar"));

  _chokidar = function _chokidar() {
    return data;
  };

  return data;
}

function _through() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/through2"));

  _through = function _through() {
    return data;
  };

  return data;
}

function _vinylFs() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/vinyl-fs"));

  _vinylFs = function _vinylFs() {
    return data;
  };

  return data;
}

function _gulpIf() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-if"));

  _gulpIf = function _gulpIf() {
    return data;
  };

  return data;
}

function _gulpLess() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/gulp-less"));

  _gulpLess = function _gulpLess() {
    return data;
  };

  return data;
}

function _rimraf() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/rimraf"));

  _rimraf = function _rimraf() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/chalk"));

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/slash"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _utils = require("./utils");

var _getBabelConifg = _interopRequireDefault(require("./getBabelConifg"));

var _getTsConifg = _interopRequireDefault(require("./getTsConifg"));

var _replaceAll = _interopRequireDefault(require("./replaceAll"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const modeType = {
  cjs: 'Commonjs',
  esm: 'ES Modules'
};

class Build {
  constructor(options) {
    var _options$cwd;

    this.cwd = void 0;
    this.isLerna = void 0;
    this.watch = void 0;
    this.rootConfig = {};
    this.userConfig = void 0;
    this.customPrefix = void 0;
    this.tsConifgError = void 0;
    this.cache = {};
    this.cwd = (_options$cwd = options.cwd) != null ? _options$cwd : process.cwd();
    this.userConfig = options.userConfig;
    this.customPrefix = options.customPrefix;
    this.watch = !!options.watch;
    this.isLerna = !this.userConfig ? _fs().default.existsSync(_path().default.join(this.cwd, 'lerna.json')) : false;
  }

  logInfo({
    pkg,
    msg
  }) {
    console.log(`${pkg ? `${(0, _utils.colorLog)(pkg)}: ` : ''}${msg}`);
  }

  applyHook(func, args) {
    return typeof func === 'function' ? func(args) : _through().default.obj();
  }

  addDefaultConfigValue(config) {
    return (0, _deepmerge().default)({
      entry: 'src',
      output: 'lib',
      target: 'browser',
      moduleType: 'esm',
      sourceMaps: false
    }, config);
  }

  getBundleOpts(cwd) {
    var _this$userConfig;

    const userConfig = (_this$userConfig = this.userConfig) != null ? _this$userConfig : (0, _config.default)(cwd); // The merge method will change the source object

    const bundleOpts = this.addDefaultConfigValue((0, _deepmerge().default)(_extends({}, this.rootConfig), userConfig));
    return bundleOpts;
  }

  transform(opts) {
    const content = opts.content,
          paths = opts.paths,
          bundleOpts = opts.bundleOpts,
          currentDir = opts.currentDir;
    const target = bundleOpts.target,
          nodeFiles = bundleOpts.nodeFiles,
          browserFiles = bundleOpts.browserFiles,
          sourcemap = bundleOpts.sourcemap;
    let isBrowser = target === 'browser';

    if (/\.(t|j)sx$/.test(paths)) {
      isBrowser = true;
    } else {
      const currentPath = _path().default.relative(currentDir, paths);

      if (isBrowser && nodeFiles && nodeFiles.includes(currentPath)) {
        isBrowser = false;
      }

      if (!isBrowser && browserFiles && browserFiles.includes(currentPath)) {
        isBrowser = true;
      }
    }

    const babelConfig = (0, _getBabelConifg.default)(bundleOpts, isBrowser);
    return (0, _core().transformSync)(content, _extends({}, babelConfig, {
      filename: paths,
      configFile: false,
      sourceMaps: sourcemap
    }));
  }

  isTransform(regExp, filePath) {
    return regExp.test(filePath) && !filePath.endsWith('.d.ts');
  }

  createStream({
    src,
    pkg,
    dir,
    bundleOpts
  }) {
    const entry = bundleOpts.entry,
          output = bundleOpts.output,
          esBuild = bundleOpts.esBuild,
          paths = bundleOpts.paths,
          lessOptions = bundleOpts.lessOptions,
          beforeReadWriteStream = bundleOpts.beforeReadWriteStream,
          afterReadWriteStream = bundleOpts.afterReadWriteStream,
          sourcemap = bundleOpts.sourcemap;

    const _getTSConfig = (0, _getTsConifg.default)(this.cwd, this.isLerna ? dir : ''),
          tsConfig = _getTSConfig.tsConfig,
          error = _getTSConfig.error;

    const basePath = _path().default.join(dir, entry);

    if (tsConfig.compilerOptions.declaration === true) {
      if (bundleOpts.disableTypes === true) {
        tsConfig.compilerOptions.declaration = false;
      }
    } else {
      bundleOpts.disableTypes = true;
    }

    if (error) {
      this.tsConifgError = error;
    }

    return _vinylFs().default.src(src, {
      base: basePath,
      allowEmpty: true
    }).pipe((0, _gulpIf().default)(() => !!sourcemap, _gulpSourcemaps().default.init())).pipe((0, _gulpIf().default)(this.watch, (0, _gulpPlumber().default)(() => {}))).pipe(_gulpInsert().default.transform((contents, file) => {
      this.cache[file.path] = contents;
      return contents;
    })).pipe((0, _gulpIf().default)(file => file.path.endsWith('.less'), (0, _gulpLess().default)(lessOptions))).pipe(this.applyHook(beforeReadWriteStream, {
      through: _through().default,
      insert: _gulpInsert().default,
      gulpIf: _gulpIf().default
    })).pipe(_gulpInsert().default.transform((contents, file) => {
      const _paths = _extends({}, paths);

      if (Object.keys(_paths).length) {
        const dirname = _path().default.dirname(file.path);

        const ext = _path().default.extname(file.relative);

        contents = (0, _replaceAll.default)({
          ext,
          contents,
          dirname,
          aliasMap: _paths
        });
      }

      return contents;
    })).pipe((0, _gulpIf().default)(file => tsConfig.compilerOptions.declaration && this.isTransform(/\.tsx?$/, file.path), (0, _gulpTypescript().default)(tsConfig.compilerOptions, {
      error: err => {
        console.log(`${_chalk().default.red('➜ [Error]: ')}${err.message}`);
      }
    }))).pipe((0, _gulpIf().default)(file => this.isTransform(/\.(t|j)sx?$/, file.path), _through().default.obj((chunk, _enc, callback) => {
      var _this$customPrefix;

      const res = this.transform({
        content: chunk.contents,
        paths: (0, _slash().default)(chunk.path),
        bundleOpts,
        currentDir: dir
      });

      const replaceExtname = file => file.replace(_path().default.extname(file), '.js');

      chunk.contents = Buffer.from(res.code);

      const logType = _chalk().default.yellow(`[${(_this$customPrefix = this.customPrefix) != null ? _this$customPrefix : esBuild ? 'esBuild' : 'babel'}]:`);

      const logOutput = _chalk().default.blue(output + chunk.path.replace(basePath, ''));

      if (chunk.sourceMap && sourcemap) {
        if (!Object.prototype.hasOwnProperty.call(res.map, 'file')) {
          if (typeof res.map === 'string') {
            res.map = JSON.parse(res.map);
            res.map.sources = [_path().default.basename(chunk.path)];
          }

          res.map.file = chunk.sourceMap.file;
        }

        require('vinyl-sourcemaps-apply')(chunk, res.map);
      }

      this.logInfo({
        pkg,
        msg: `➜ ${logType} for ${(0, _slash().default)(logOutput)}`
      });
      chunk.path = replaceExtname(chunk.path);
      callback(null, chunk);
    }), _gulpInsert().default.transform((contents, file) => {
      if (!file.path.endsWith('.d.ts')) {
        var _this$customPrefix2;

        const logType = _chalk().default.yellow(`[${(_this$customPrefix2 = this.customPrefix) != null ? _this$customPrefix2 : 'Copys'}]:`);

        const logOutput = _chalk().default.blue(output + file.path.replace(basePath, ''));

        this.logInfo({
          pkg,
          msg: `➜ ${logType} for ${(0, _slash().default)(logOutput)}`
        });
      }

      return contents;
    }))).pipe(this.applyHook(afterReadWriteStream, {
      through: _through().default,
      insert: _gulpInsert().default,
      gulpIf: _gulpIf().default
    })).pipe((0, _gulpIf().default)(file => !!sourcemap && !file.path.endsWith('.d.ts'), _gulpSourcemaps().default.write('.'))).pipe(_vinylFs().default.dest(_path().default.join(dir, output)));
  }

  compileLerna() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let userPkgs = _fs().default.readdirSync(_path().default.join(_this.cwd, 'packages'));

      const userConifg = (0, _config.default)(_this.cwd);

      if (userConifg.pkgs) {
        userPkgs = userConifg.pkgs;
      }

      _this.rootConfig = _this.addDefaultConfigValue(userConifg);
      userPkgs = userPkgs.reduce((memo, pkg) => {
        const pkgPath = _path().default.join(_this.cwd, 'packages', pkg);

        if (_fs().default.statSync(pkgPath).isDirectory()) {
          memo = memo.concat(pkg);
        }

        return memo;
      }, []);

      for (var _iterator = _createForOfIteratorHelperLoose(userPkgs), _step; !(_step = _iterator()).done;) {
        const pkg = _step.value;

        const pkgPath = _path().default.join(_this.cwd, 'packages', pkg);

        (0, _assert().default)(_fs().default.existsSync(_path().default.join(pkgPath, 'package.json')), `package.json not found in packages/${pkg}`);
        process.chdir(pkgPath); // here is safe
        // eslint-disable-next-line no-await-in-loop

        yield _this.compile(pkgPath, pkg);
      }
    })();
  }

  compile(dir, pkg) {
    var _this$customPrefix3;

    const bundleOpts = this.getBundleOpts(dir);
    const entry = bundleOpts.entry,
          output = bundleOpts.output,
          afterHook = bundleOpts.afterHook;
    this.logInfo({
      pkg,
      msg: _chalk().default.redBright(`➜ [Clean]: ${output} directory`)
    });

    _rimraf().default.sync(_path().default.join(dir, output));

    this.logInfo({
      pkg,
      msg: _chalk().default.red(`➜ [Target]: ${(_this$customPrefix3 = this.customPrefix) != null ? _this$customPrefix3 : modeType[bundleOpts.moduleType]}`)
    });

    const createStream = src => this.createStream({
      src,
      pkg,
      dir,
      bundleOpts
    });

    return new Promise(resolve => {
      const srcPath = _path().default.join(dir, entry);

      const patterns = [_path().default.join(srcPath, '**/*'), `!${_path().default.join(srcPath, '**/*.mdx')}`, `!${_path().default.join(srcPath, '**/*.md')}`, `!${_path().default.join(srcPath, '**/demos{,/**}')}`, `!${_path().default.join(srcPath, '**/fixtures{,/**}')}`, `!${_path().default.join(srcPath, '**/__test__{,/**}')}`, `!${_path().default.join(srcPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`];
      createStream(patterns).on('end', () => {
        afterHook && afterHook();

        if (this.watch) {
          this.logInfo({
            pkg,
            msg: _chalk().default.blue(`➜ Start watching ${pkg != null ? pkg : (0, _slash().default)(srcPath).replace(`${(0, _slash().default)(this.cwd)}/`, '')} directory...`)
          });

          if (this.tsConifgError) {
            let messageText = this.tsConifgError.messageText;

            if (this.tsConifgError.code === 5012) {
              messageText = 'Cannot find tsconfig.json, use the default configuration';
            }

            this.logInfo({
              msg: _chalk().default.yellow('❗' + messageText + '\n')
            });
          }

          const watcher = _chokidar().default.watch(patterns, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 200
            }
          });

          const files = [];
          watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(srcPath, '');
            const outPath = (0, _slash().default)(_path().default.join(srcPath, relPath)).replace((0, _slash().default)(this.cwd) + '/', '');
            this.logInfo({
              msg: `${(0, _utils.eventColor)(event)} ${outPath}`
            });

            if (!_fs().default.existsSync(fullPath)) {
              const fullLibPath = fullPath.replace(entry, output);

              if (fullLibPath.endsWith('.ts')) {
                _rimraf().default.sync(fullLibPath.replace('.ts', '.js'));

                _rimraf().default.sync(fullLibPath.replace('.ts', '.d.ts'));

                return;
              }

              _rimraf().default.sync(fullLibPath);

              return;
            }

            if (_fs().default.statSync(fullPath).isFile()) {
              const data = _fs().default.readFileSync(fullPath, 'utf-8');

              if (this.cache[fullPath] === data) return;
              if (!files.includes(fullPath)) files.push(fullPath);

              while (files.length) {
                createStream(files.pop());
              }
            }
          });
          process.once('SIGINT', () => {
            watcher.close();
          });
        }

        resolve();
      });
    });
  }

  step() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.isLerna) {
        yield _this2.compileLerna();
      } else {
        yield _this2.compile(_this2.cwd);
      }
    })();
  }

}

exports.default = Build;
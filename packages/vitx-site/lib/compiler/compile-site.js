function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVue from '@vitejs/plugin-vue';
import { createServer } from 'vite';
import * as path from 'path';
export function compileSite() {
  return _compileSite.apply(this, arguments);
}

function _compileSite() {
  _compileSite = _asyncToGenerator(function* () {
    var server = yield createServer({
      root: path.join(path.resolve(), '../template/vue'),
      // /\.md$/
      plugins: [vitePluginVue({
        include: [/\.vue$/]
      }) // vitePluginJsx()
      ]
    });
    yield server.listen();
    server.printUrls();
  });
  return _compileSite.apply(this, arguments);
}

compileSite();
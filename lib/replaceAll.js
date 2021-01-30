"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceAll;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("slash"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The main part comes from the link below, with appropriate modifications
// https://github.com/CryUshio/gulp-path-alias#readme
const suffixPatten = `\\/|['"]|\\s*\\)`;
const prefixPattenMap = {
  js: `import\\s*[^'"]*\\(?|from|require\\s*\\(`,
  xml: `src=|url=|poster=|href=`,
  css: `@import\\s*|url\\s*\\(`
};

function relative(from, to) {
  const relativePath = (0, _slash().default)(_path().default.relative(from, to));

  if (!relativePath) {
    return '.';
  }

  return !/^\./.test(relativePath) ? `./${relativePath}` : relativePath;
}

function getRegExp(prefixPatten) {
  return function (aliasName) {
    return new RegExp(`(?:(${prefixPatten})\\s*['"]?\\s*)${aliasName}(${suffixPatten})`, 'gm');
  };
}

function replaceAll(options) {
  const ext = options.ext,
        dirname = options.dirname,
        aliasMap = options.aliasMap;
  let contents = options.contents;
  let reg;

  switch (ext) {
    case '.js':
    case '.ts':
    case '.wxs':
      reg = getRegExp(prefixPattenMap.js);
      break;

    case '.css':
    case '.less':
    case '.scss':
    case '.styl':
    case '.stylus':
    case '.wxss':
      reg = getRegExp(prefixPattenMap.css);
      break;

    case '.html':
    case '.wxml':
      reg = getRegExp(prefixPattenMap.xml);
      break;

    case '.jsx':
    case '.tsx':
    default:
      reg = getRegExp(Object.keys(prefixPattenMap).map(k => prefixPattenMap[k]).join('|'));
      break;
  }

  Object.keys(aliasMap).forEach(alias => {
    const regExp = reg(alias);
    const subReg = new RegExp(`${alias}(${suffixPatten})`);
    const replacer = `${relative(dirname, aliasMap[alias])}$1`;
    contents = contents.replace(regExp, match => match.replace(subReg, replacer));
  });
  return contents;
}
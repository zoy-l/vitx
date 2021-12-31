"use strict";

exports.__esModule = true;
exports.default = void 0;
exports.parseId = parseId;
exports.vitePluginMarkdownReact = vitePluginMarkdownReact;
exports.vitePluginMarkdownVue = vitePluginMarkdownVue;

var _compilerSfc = require("@vue/compiler-sfc");

var _esBuild = require("esBuild");

var _markdownIt = _interopRequireDefault(require("markdown-it"));

var _htmltojsx = _interopRequireDefault(require("htmltojsx"));

var _grayMatter = _interopRequireDefault(require("gray-matter"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function toArray(n) {
  if (!Array.isArray(n)) return [n];
  return n;
}

function parseId(id) {
  var index = id.indexOf('?');
  if (index < 0) return id;
  return id.slice(0, index);
}

function vitePluginMarkdown(options) {
  var resolved = _extends({
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: function markdownItSetup() {},
    wrapperClasses: 'markdown-body',
    transforms: {}
  }, options != null ? options : {});

  var markdown = new _markdownIt.default(_extends({
    html: true,
    linkify: true,
    typographer: true
  }, resolved.markdownItOptions));
  resolved.markdownItUses.forEach(function (e) {
    var _toArray = toArray(e),
        plugin = _toArray[0],
        options = _toArray[1];

    markdown.use(plugin, options);
  });
  resolved.markdownItSetup(markdown);
  var wrapperClasses = toArray(resolved.wrapperClasses).filter(function (i) {
    return i;
  }).join(' ');
  var config;
  return {
    name: 'vite-plugin-mdn',
    enforce: 'pre',
    configResolved: function configResolved(_config) {
      config = _config;
    },
    transform: function transform(raw, id) {
      var path = parseId(id);

      if (!path.endsWith('.md')) {
        return raw;
      }

      if (resolved.transforms.before) {
        raw = resolved.transforms.before(raw, id);
      }

      var _matter = (0, _grayMatter.default)(raw),
          md = _matter.content,
          frontmatter = _matter.data;

      var code = markdown.render(md, {});

      if (resolved.wrapperClasses) {
        code = `<div class="${wrapperClasses}">${code}</div>`;
      }

      if (resolved.transforms.after) {
        code = resolved.transforms.after(code, id);
      }

      function componentVue() {
        var _config2;

        var _compileTemplate = (0, _compilerSfc.compileTemplate)({
          filename: path,
          id: path,
          source: code,
          transformAssetUrls: false
        }),
            result = _compileTemplate.code;

        result = result.replace('export function render', 'function render');
        result += `\nconst __matter = ${JSON.stringify(frontmatter)};`;
        result += '\nconst data = () => ({ frontmatter: __matter });';
        result += '\nconst __script = { render, data };';

        if (!((_config2 = config) != null && _config2.isProduction)) {
          result += `\n__script.__hmrId = ${JSON.stringify(path)};`;
        }

        result += '\nexport default __script;';
        return result;
      }

      function componentReact() {
        var componentName = (0, _path.basename)(path, '.md');
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        var RE = /\{\{((?:.|\r?\n))+?\}\}/g;
        code = code.replace(RE, function (interpolation) {
          var variable = interpolation.replace(/{|}|\s/g, '');
          var keys = variable.split('.').slice(1);
          return frontmatter[keys.join('.')];
        });
        var converter = new _htmltojsx.default({
          createClass: false
        });
        var content = `
        import React from 'react'
        export default function ${componentName}(props){
          const html = ${converter.convert(code)}
          return <div {...props}>{ html }</div>
        }`;
        var result = (0, _esBuild.transformSync)(content, {
          loader: 'jsx'
        });
        return result.code;
      }

      var transfromFrame = {
        vue: componentVue,
        react: componentReact
      };
      return transfromFrame[resolved.frame]();
    }
  };
}

function vitePluginMarkdownReact(options) {
  return vitePluginMarkdown(_extends({
    frame: 'react'
  }, options));
}

function vitePluginMarkdownVue(options) {
  return vitePluginMarkdown(_extends({
    frame: 'vue'
  }, options));
}

var _default = vitePluginMarkdown;
exports.default = _default;
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { compileTemplate } from '@vue/compiler-sfc';
import { transformSync } from 'esBuild';
import MarkdownIt from 'markdown-it';
import HtmlToJsx from 'htmltojsx';
import matter from 'gray-matter';
import { basename } from 'path';

function toArray(n) {
  if (!Array.isArray(n)) return [n];
  return n;
}

export function parseId(id) {
  const index = id.indexOf('?');
  if (index < 0) return id;
  return id.slice(0, index);
}

function VitePluginMarkdown(options) {
  const resolved = _extends({
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: () => {},
    wrapperClasses: 'markdown-body',
    transforms: {}
  }, options != null ? options : {});

  const markdown = new MarkdownIt(_extends({
    html: true,
    linkify: true,
    typographer: true
  }, resolved.markdownItOptions));
  resolved.markdownItUses.forEach(e => {
    const _toArray = toArray(e),
          plugin = _toArray[0],
          options = _toArray[1];

    markdown.use(plugin, options);
  });
  resolved.markdownItSetup(markdown);
  const wrapperClasses = toArray(resolved.wrapperClasses).filter(i => i).join(' ');
  let config;
  return {
    name: 'vite-plugin-mdn',
    enforce: 'pre',

    configResolved(_config) {
      config = _config;
    },

    transform(raw, id) {
      const path = parseId(id);

      if (!path.endsWith('.md')) {
        return raw;
      }

      if (resolved.transforms.before) {
        raw = resolved.transforms.before(raw, id);
      }

      const _matter = matter(raw),
            md = _matter.content,
            frontmatter = _matter.data;

      let code = markdown.render(md, {});

      if (resolved.wrapperClasses) {
        code = `<div class="${wrapperClasses}">${code}</div>`;
      }

      if (resolved.transforms.after) {
        code = resolved.transforms.after(code, id);
      }

      function componentVue() {
        var _config2;

        let _compileTemplate = compileTemplate({
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
        let componentName = basename(path, '.md');
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
        const RE = /\{\{((?:.|\r?\n))+?\}\}/g;
        code = code.replace(RE, interpolation => {
          const variable = interpolation.replace(/{|}|\s/g, '');
          const keys = variable.split('.').slice(1);
          return frontmatter[keys.join('.')];
        });
        const converter = new HtmlToJsx({
          createClass: false
        });
        const content = `
        import React from 'react'
        export default function ${componentName}(props){
          const html = ${converter.convert(code)}
          return <div {...props}>{ html }</div>
        }`;
        const result = transformSync(content, {
          loader: 'jsx'
        });
        return result.code;
      }

      const transfromFrame = {
        vue: componentVue,
        react: componentReact
      };
      return transfromFrame[resolved.frame]();
    }

  };
}

export default VitePluginMarkdown;
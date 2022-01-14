import highlight from 'highlight.js'

export function mdBodyWrapper(code: string) {
  return `<div class="markdown-body__content">\n\n${code}\n\n</div> \n\n\${toc}\n`
}

export function vueAnchorsLink(code: string) {
  code += `
  import anchorsLink from '@vitx-documents-md';
    __script.mounted = function(){
      anchorsLink()
    };\n
  `
  return code
}

export const reactAnchorsLink = {
  import: `import anchorsLink from '@vitx-documents-md';`,
  content: `
  React.useEffect(()=>{
    anchorsLink()
  },[])
  `
}

export function markdownHighlight(code: string, lang: string) {
  if (lang && highlight.getLanguage(lang)) {
    return highlight.highlight(code, { language: lang, ignoreIllegals: true }).value
  }

  return ''
}

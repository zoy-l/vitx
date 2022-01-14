const camelizeRE = /-(\w)/g
const pascalizeRE = /(\w)(\w*)/g

export function camelize(str: string): string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

export function pascalize(str: string): string {
  return camelize(str).replace(pascalizeRE, (_, c1, c2) => c1.toUpperCase() + c2)
}

export function formatName(component: string, lang?: string) {
  component = pascalize(component)

  if (lang) {
    return `${component}_${lang.replace('-', '_')}`
  }

  return component
}

export function parseName(name: string) {
  function decamelize(name: string, sep = '-') {
    return name
      .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
      .toLowerCase()
  }

  if (name.indexOf('_') !== -1) {
    const pairs = name.split('_')
    const component = pairs.shift()

    return {
      component: `${decamelize(component)}`,
      lang: pairs.join('-')
    }
  }

  return {
    component: `${decamelize(name)}`,
    lang: ''
  }
}

const fs = require('fs-extra')
const path = require('path')

function reviseGulpInsert(name) {
  fs.writeFileSync(
    path.join(__dirname, name, 'index.d.ts'),
    `import File = require('vinyl')
  declare namespace Insert {
    /**
     * Prepends a string onto the contents
     * @param {string} content
     * @returns {NodeJS.ReadWriteStream}
     */
    function prepend(content: string): NodeJS.ReadWriteStream
  
    /**
     * Appends a string onto the contents
     * @param {string} content
     * @returns {NodeJS.ReadWriteStream}
     */
    function append(content: string): NodeJS.ReadWriteStream
  
    /**
     * Wraps the contents with two strings
     * @param {string} prepend
     * @param {string} append
     * @returns {NodeJS.ReadWriteStream}
     */
    function wrap(prepend: string, append: string): NodeJS.ReadWriteStream
  
    /**
     * Calls a function with the contents of the file
     * @param {Transformer} transformer
     * @returns {NodeJS.ReadWriteStream}
     */
    function transform(transformer: Transformer): NodeJS.ReadWriteStream
  }
  
  interface Transformer {
    (contents: string, file: File): string
  }
  
  export = Insert`,
    'utf8'
  )
}

const revise = {
  'gulp-insert': reviseGulpInsert
}

module.exports = revise

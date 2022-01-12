// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import generator from '@vitx/bundles/model/@babel/generator'
import traverse from '@vitx/bundles/model/@babel/traverse'
import { parse } from '@vitx/bundles/model/@babel/parser'
import * as t from '@vitx/bundles/model/@babel/types'
import { parseId } from 'vite-plugin-mds'
import { PluginOption } from 'vite'

export default function smoothFunctionComponent(): PluginOption {
  return {
    name: 'vite-plugin-smooth-function-component',
    transform(raw, id) {
      const path = parseId(id)

      if (!path.endsWith('.jsx')) {
        return
      }

      const ast = parse(raw, { plugins: ['jsx'], sourceType: 'module' })

      traverse(ast, {
        Program(path) {
          path.node.body = path.node.body.map((item) => {
            if (
              item.type === 'FunctionDeclaration' ||
              item.type === 'ExportNamedDeclaration' ||
              item.type === 'ExportDefaultDeclaration' ||
              item.type === 'VariableDeclaration'
            ) {
              if (
                item.type === 'ExportNamedDeclaration' &&
                item.declaration.type === 'FunctionDeclaration'
              ) {
                item.declaration.body.body.forEach((itemBlock) => {
                  if (
                    itemBlock.type === 'ReturnStatement' &&
                    itemBlock.argument.type === 'JSXElement'
                  ) {
                    itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                    const setup = t.objectMethod(
                      'method',
                      t.identifier('setup'),
                      item.declaration.params,
                      item.declaration.body
                    )

                    const value = t.objectExpression([setup])
                    const declarations = t.variableDeclarator(item.declaration.id, value)

                    item.declaration = t.variableDeclaration('const', [declarations])
                  }
                })
              } else if (item.type === 'FunctionDeclaration') {
                item.body.body.forEach((itemBlock) => {
                  if (
                    itemBlock.type === 'ReturnStatement' &&
                    itemBlock.argument.type === 'JSXElement'
                  ) {
                    itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                    const setup = t.objectMethod(
                      'method',
                      t.identifier('setup'),
                      item.params,
                      item.body
                    )

                    const value = t.objectExpression([setup])
                    const declarations = t.variableDeclarator(item.id, value)

                    item = t.variableDeclaration('const', [declarations])
                  }
                })
              } else if (item.type === 'ExportDefaultDeclaration') {
                item.declaration?.body?.body.forEach((itemBlock: Statement) => {
                  if (
                    itemBlock.type === 'ReturnStatement' &&
                    itemBlock.argument.type === 'JSXElement'
                  ) {
                    itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                    const setup = t.objectMethod(
                      'method',
                      t.identifier('setup'),
                      item.declaration.params,
                      item.declaration.body
                    )

                    const value = t.objectExpression([setup])

                    item.declaration = value
                  }
                })
              } else if (item.type === 'VariableDeclaration') {
                item.declarations.forEach((itemBlock) => {
                  if (
                    itemBlock.init.type === 'ArrowFunctionExpression' ||
                    itemBlock.init.type === 'FunctionExpression'
                  ) {
                    itemBlock.init.body.body.forEach((childBlock) => {
                      if (
                        childBlock.type === 'ReturnStatement' &&
                        childBlock.argument.type === 'JSXElement'
                      ) {
                        childBlock.argument = t.arrowFunctionExpression([], childBlock.argument)

                        const setup = t.objectProperty(t.identifier('setup'), itemBlock.init)
                        const value = t.objectExpression([setup])

                        itemBlock.init = value
                      }
                    })
                  }
                })
              }
            }

            return item
          })
        }
      })

      raw = generator(ast)

      return raw
    }
  }
}

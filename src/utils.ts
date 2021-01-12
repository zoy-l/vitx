import chalk from 'chalk'

const colors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright'
]

let index = 0
const cache = {}

export function colorLog(pkg: string) {
  if (!cache[pkg]) {
    const color = colors[index]
    const str = chalk[color].bold(pkg)
    cache[pkg] = str
    if (index === colors.length - 1) {
      index = 0
    } else {
      index += 1
    }
  }
  return cache[pkg]
}

export function eventColor(
  eventType: 'unlink' | 'add' | 'change' | 'addDir' | 'unlinkDir'
) {
  const { black } = chalk
  return {
    unlink: black.bgRed,
    add: black.bgGreen,
    change: black.bgYellow,
    unlinkDir: black.bgRed,
    addDir: black.bgGreen
  }[eventType](` ${eventType} `)
}

export function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

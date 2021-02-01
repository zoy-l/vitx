#!/usr/bin/env node

if (!__dirname.includes('node_modules') && process.env.NODE_ENV === 'debug') {
  try {
    require('source-map-support').install()
    require('../debug/cli')
  } catch (e) {
    // ignore
  }
} else {
  require('../lib/cli')
}

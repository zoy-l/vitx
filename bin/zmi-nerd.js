#!/usr/bin/env node

if (!__dirname.includes('node_modules')) {
  try {
    require('source-map-support').install()
  } catch (e) {}
}

require('../lib/cli')

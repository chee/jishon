#!/usr/bin/env node

const jishon = require('./index.js')

jishon(process.argv.slice(2).join(' '))
  .then(JSON.stringify)
  .then(console.log)

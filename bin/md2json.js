#!/usr/bin/env node

const readline = require('readline')
const parse = require('../dist/md2json.js')

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

const lines = []

readlineInterface.on('line', line => {
  lines.push(line)
})

readlineInterface.on('close', () => {
  const result = JSON.stringify(parse(lines), null, 2)
  console.log(result)
})

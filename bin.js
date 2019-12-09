#!/usr/bin/env node

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

process.stdin.on('data', data => {
  const thing = decoder.write(data)
  console.log(thing)
})

// const readline = require('readline')
// const parse = require('./parser')

// const readlineInterface = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
//     console: false
// })

// const lines = []

// readlineInterface.on('line', line => {
//   lines.push(line)
//   console.log('pushing', line)
// })

// readlineInterface.on('close', () => {
//   // console.log(lines)
//   const result = JSON.stringify(parse(lines), null, 2)
//   console.log(result)
// })

// // process.exit()

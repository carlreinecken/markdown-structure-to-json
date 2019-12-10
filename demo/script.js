/* global md2json */

const inputEl = document.getElementById('input')
const outputEl = document.getElementById('output')
inputEl.addEventListener('input', parseMarkdownToJson)

inputEl.value = '# Hello!\n\nType some markdown:'
parseMarkdownToJson()

function parseMarkdownToJson () {
  const result = JSON.stringify(md2json(inputEl.value), null, 2)
  outputEl.innerHTML = result
}

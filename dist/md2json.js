(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.md2json = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./src/parser')

},{"./src/parser":2}],2:[function(require,module,exports){
module.exports = (text) => {
  const HEADER_REGEX = /^#{1,6} /
  const LIST_REGEX = /^( *)(\d\.|\+|-|\*) /

  function getHeaderLevel (line) {
    if (line == null) {
      return null
    }

    const match = line.match(HEADER_REGEX)

    if (match == null) {
      return null
    }

    return match[0].trim().length
  }

  function getTypeOf (line) {
    if (HEADER_REGEX.test(line)) {
      return 'header'
    }

    if (LIST_REGEX.test(line)) {
      return 'list'
    }

    return 'paragraph'
  }

  function getListLevel (line) {
    const match = line.match(LIST_REGEX)

    if (match == null) {
      return null
    }

    return match[1].length
  }

  function makeContentList (lines) {
    if (!lines || lines.length < 1) {
      return lines
    }

    const result = []

    // if the first lines are not headers add them to the result
    while (lines[0] != null && getTypeOf(lines[0]) === 'paragraph') {
      let newLine = lines.shift()
      result.push(newLine)
    }

    // it may happen that in these lines there were just paragraphs nothing more
    if (lines.length < 1) {
      return result
    }

    // the next line can only be NOT a paragraph
    const lineType = getTypeOf(lines[0])
    const block = { content: [] }
    let level = null

    if (lineType === 'header') {
      level = getHeaderLevel(lines[0])
      block.header = lines.shift().replace(HEADER_REGEX, '')

      while (lines[0] != null && getHeaderLevel(lines[0]) !== level) {
        let newLine = lines.shift()
        block.content.push(newLine)
      }
    } else if (lineType === 'list') {
      level = getListLevel(lines[0])
      block.type = 'list'

      while (lines[0] != null && getTypeOf(lines[0]) === 'list') {
        let newLine = lines.shift()
        if (getListLevel(newLine) === level) {
          newLine = newLine.replace(LIST_REGEX, '')
        }
        block.content.push(newLine)
      }
    }

    // if in the content are not just paragraphs, this should turn them to a block
    block.content = makeContentList(block.content)

    result.push(block)

    // all the lines after the block have to be parsed as well
    makeContentList(lines).map(blck => result.push(blck))

    return result
  }

  if (!Array.isArray(text)) {
    text = text.split('\n')
  }
  text = text.filter(line => line !== '')
  return makeContentList(text)
}

},{}]},{},[1])(1)
});
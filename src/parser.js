export default (text) => {
  const HEADER_REGEX = /^#{1,6} /
  const LIST_REGEX = /^( *)(\d\.|\+|-|\*) /

  function getTypeOf (line) {
    if (HEADER_REGEX.test(line)) {
      return 'header'
    } else if (LIST_REGEX.test(line)) {
      return 'list'
    }
    return 'paragraph'
  }

  function getHeaderLevel (line) {
    const match = line.match(HEADER_REGEX)

    if (match == null) {
      return null
    }

    return match[0].trim().length
  }

  function getListLevel (line) {
    const match = line.match(LIST_REGEX)

    if (match == null) {
      return null
    }

    return match[1].length
  }

  function makeHeaderBlock (lines) {
    const block = { content: [] }
    const level = getHeaderLevel(lines[0])

    block.header = lines.shift().replace(HEADER_REGEX, '')

    while (lines[0] != null && getHeaderLevel(lines[0]) !== level) {
      let newLine = lines.shift()
      block.content.push(newLine)
    }

    return { lines, block }
  }

  function makeListBlock (lines) {
    const block = { content: [] }
    const level = getListLevel(lines[0])

    block.type = 'list'

    while (lines[0] != null && getTypeOf(lines[0]) === 'list') {
      let newLine = lines.shift()
      if (getListLevel(newLine) === level) {
        newLine = newLine.replace(LIST_REGEX, '')
      }
      block.content.push(newLine)
    }

    return { lines, block }
  }

  function makeContent (lines) {
    if (!lines || lines.length < 1) {
      return lines
    }

    const result = []

    // add all paragraphs before the next block
    while (lines[0] != null && getTypeOf(lines[0]) === 'paragraph') {
      let newLine = lines.shift()
      result.push(newLine)
    }

    if (lines.length < 1) {
      // no blocks, only paragraphs
      return result
    }

    // the next line starts a block
    const lineType = getTypeOf(lines[0])
    let block
    if (lineType === 'header') {
      ({ block, lines } = makeHeaderBlock(lines))
    } else if (lineType === 'list') {
      ({ block, lines } = makeListBlock(lines))
    }

    // parse block.content to blocks or leave them as paragraphs
    block.content = makeContent(block.content)

    result.push(block)

    // add all paragraphs and blocks after the the last block
    makeContent(lines).map(blck => result.push(blck))

    return result
  }

  if (!Array.isArray(text)) {
    text = text.split('\n')
  }
  text = text.filter(line => line !== '')
  return makeContent(text)
}

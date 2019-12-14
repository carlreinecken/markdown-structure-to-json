export default (text, options) => {
  let HEADER_REGEX = null
  let LIST_REGEX = null

  const OPTION_DEFAULTS = {
    keepBlankLines: false,
    maxHeaderLevel: 6,
    parseLists: true
  }

  const BLOCK_TYPE = {
    PARAGRAPH: 'paragraph',
    HEADER: 'header',
    LIST: 'list'
  }

  function buildHeaderRegex (options) {
    if (!/^[1-6]{1}$/.test(options.maxHeaderLevel)) {
      throw new TypeError('Invalid option maxHeaderLevel: ' + options.maxHeaderLevel)
    }

    let result = '^#{1,'
    result += options.maxHeaderLevel
    result += '} '
    return new RegExp(result)
  }

  function buildListRegex (options) {
    if (options.parseLists === false) {
      return new RegExp('(?!)')
    }

    let charRegex = null
    if (options.parseLists === true) {
      charRegex = ['\\d\\.', '\\+', '-', '\\*']
    } else {
      const chars = options.parseLists.split('').filter(char => /\*|\+|-|\./.test(char))

      if (chars.length < 1 || chars.length > 4) {
        throw new TypeError('Invalid option parseLists: ' + options.parseLists)
      }

      const charKeyMap = {
        '.': '\\d\\.',
        '*': '\\*',
        '+': '\\+',
        '-': '-'
      }

      charRegex = chars.map(char => charKeyMap[char])
    }

    let result = '^( *)('
    result += charRegex.join('|')
    result += ') '
    return new RegExp(result)
  }

  function getTypeOf (line) {
    if (HEADER_REGEX.test(line)) {
      return BLOCK_TYPE.HEADER
    } else if (LIST_REGEX.test(line)) {
      return BLOCK_TYPE.LIST
    }
    return BLOCK_TYPE.PARAGRAPH
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

    block.type = BLOCK_TYPE.LIST

    while (lines[0] != null && getTypeOf(lines[0]) === BLOCK_TYPE.LIST) {
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
    while (lines[0] != null && getTypeOf(lines[0]) === BLOCK_TYPE.PARAGRAPH) {
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
    if (lineType === BLOCK_TYPE.HEADER) {
      ({ block, lines } = makeHeaderBlock(lines))
    } else if (lineType === BLOCK_TYPE.LIST) {
      ({ block, lines } = makeListBlock(lines))
    }

    // parse block.content to blocks or leave them as paragraphs
    block.content = makeContent(block.content)

    result.push(block)

    // add all paragraphs and blocks after the the last block
    makeContent(lines).map(blck => result.push(blck))

    return result
  }

  // -------- MAIN --------

  if (!Array.isArray(text)) {
    text = text.split('\n')
  }

  options = { ...OPTION_DEFAULTS, ...(options || {}) }

  HEADER_REGEX = buildHeaderRegex(options)
  LIST_REGEX = buildListRegex(options)

  if (HEADER_REGEX == null || LIST_REGEX == null) {
    return null
  }

  if (!options.keepBlankLines) {
    text = text.filter(line => line !== '')
  }

  return makeContent(text)
}

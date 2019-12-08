const parser = (text) => {
  const HEADER_REGEX = /^#{1,6}\ /

  function getLevel (line) {
    if (line == null) {
      return null
    }

    const match = line.match(HEADER_REGEX);

    if (match == null) {
      return null
    }

    return match[0].trim().length
  }

  function makeBlock (lines) {
    if (!lines || lines.length < 1) {
      return lines
    }

    const result = []
    let level = getLevel(lines[0])

    // if the first lines are not headers add them to the result
    if (level == null) {
      while (lines[0] != null && getLevel(lines[0]) == null) {
        let newLine = lines.shift()
        result.push(newLine)
      }
    }

    // it may happen that in the markdown there is no title...
    if (lines.length < 1) {
      return result
    }

    // at this point the next line can only be a header
    const header = lines.shift()
    level = getLevel(header)
    const block = {
      title: header.replace(HEADER_REGEX, ''),
      content: []
    }

    while (lines[0] != null && getLevel(lines[0]) != level) {
      let newLine = lines.shift()
      block.content.push(newLine)
    }

    // if in the content is another header, go make a block
    block.content = makeBlock(block.content)

    result.push(block)

    // all the lines after the block have to be parsed as well
    makeBlock(lines).map(blck => result.push(blck))

    return result
  }

  const lines = text.split("\n").filter(line => line !== '')

  return makeBlock(lines)
}

module.exports = parser

// first try using a loop...

const parser = (text) => {
  const HEADER_REGEX = /^#{1,6}\ /

  const result = []

  let blocks = []
  let currentBlock = null
  let currentBlockLevel = null

  function getHeaderLevel (line) {
    if (line == null) {
      return null
    }

    const match = line.match(HEADER_REGEX);

    if (match == null) {
      return null
    }

    return match[0].trim().length
  }

  function createBlock (title) {
    const block = { title: title, content: [] }
  }

  function parseLine (line, nextLine) {
    const headerLevel = getHeaderLevel(line)
    const headerLevelNextLine = getHeaderLevel(nextLine)

    if (headerLevel !== null) {
      const title = line.replace(HEADER_REGEX, '')
      currentBlock = { title: title, content: [] }
      currentBlockLevel = headerLevel
    } else {
      if (currentBlock == null) {
        currentBlock = { content: [] }
        currentBlockLevel = 0
      }
      currentBlock.content.push(line)
    }

    // if next line is null or next line is a header which is same or lower, then push this block
    const isNextHeaderSameLevel = headerLevelNextLine <= currentBlockLevel
    if (nextLine == null || (headerLevelNextLine !== null && isNextHeaderSameLevel)) {
      result.push(currentBlock)
      currentBlock = null
    } else {
    }
  }

  const lines = text.split("\n").filter(line => line !== '')

  for (let i = 0; i < lines.length; i++) {
    parseLine(lines[i], lines[i+1])
  }

  return result
}

module.exports = parser

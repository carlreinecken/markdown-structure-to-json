const parse = require('../index')
const expect = require('chai').expect

describe('library', function () {
  it('should get an empty array with no content', function () {
    const text = ''
    const result = parse(text)
    expect(result).to.be.empty
  })

  xit('should parse two lines separated by one new line as one paragraph', function () {
    const text = 'I do not\nwant to loose you!'
    const result = parse(text)
    expect(result).to.eql(['I do not want to loose you!'])
  })

  it('should parse a text without a header', function () {
    const text = 'I am\n\nanother paragraph and no header!'
    const result = parse(text)
    expect(result[0]).to.equal('I am')
    expect(result[1]).to.equal('another paragraph and no header!')
  })

  it('should parse a text before a header', function () {
    const text = 'You are\n\nanother paragraph with a following header!\n\n# Moin\n\nh'
    const result = parse(text)
    expect(result[0]).to.equal('You are')
    expect(result[1]).to.equal('another paragraph with a following header!')
    expect(result[2].header).to.equal('Moin')
  })

  it('should parse a text before a header and after it in the content', function () {
    const text = 'A simple\nintroduction\n\n# How are you\n\nNot bad.\nLol.'
    const result = parse(text)
    expect(result[0]).to.equal('A simple')
    expect(result[1]).to.equal('introduction')
    expect(result[2].header).to.equal('How are you')
    expect(result[2].content[0]).to.equal('Not bad.')
    expect(result[2].content[1]).to.equal('Lol.')
  })

  it('should get a header object', function () {
    const text = '# header Header 1'
    const result = parse(text)
    expect(result[0].header).to.equal('header Header 1')
  })

  it('should get a header object of level 3', function () {
    const text = '### header Header 3'
    const result = parse(text)
    expect(result[0].header).to.equal('header Header 3')
  })

  it('should not get a header object with more than 7 hash characters', function () {
    const text = '####### Text with 7 preceding hashes'
    const result = parse(text)
    expect(result[0]).to.be.equal('####### Text with 7 preceding hashes')
  })

  it('should parse a header with one paragraph', function () {
    const text = '# Another header with content\n\nI am one paragraph!'
    const result = parse(text)
    expect(result[0].header).to.equal('Another header with content')
    expect(result[0].content[0]).to.equal('I am one paragraph!')
  })

  it('should parse a header with two paragraphs', function () {
    const text = `## The story is as follows:\n\nOne paragraph meets another paragraph.\n\nBut the second paragraph does not see the first paragraph...`
    result = parse(text)
    expect(result[0].header).to.equal('The story is as follows:')
    expect(result[0].content[0]).to.equal('One paragraph meets another paragraph.')
    expect(result[0].content[1]).to.equal('But the second paragraph does not see the first paragraph...')
  })

  it('should parse header with content and another header on the same level', function () {
    const text = '# Header 1\n\nHello parser!\n\n# Header the second\n\nBye parsed one!'

    result = parse(text)

    expect(result[0].header).to.equal('Header 1')
    expect(result[0].content[0]).to.equal('Hello parser!')
    expect(result[1].header).to.equal('Header the second')
    expect(result[1].content[0]).to.equal('Bye parsed one!')
  })

  it('should parse a second nested block', function () {
    const text = [
      '# Hello dear',
      'I have something to show to you...',
      '## I present',
      'the nested block!'
    ].join('\n\n')

    result = parse(text)

    expect(result[0].header).to.equal('Hello dear')
    expect(result[0].content[0]).to.equal('I have something to show to you...')
    expect(result[0].content[1].header).to.equal('I present')
    expect(result[0].content[1].content[0]).to.equal('the nested block!')
  })

  it('should parse a block which is on the root level after a nested block', function () {
    const text = [
      '# To be honest',
      'I just did not',
      '## Expect',
      'this',
      'to',
      '# Work',
      'at all...'
    ].join('\n\n')

    result = parse(text)

    expect(result[0].header).to.equal('To be honest')
    expect(result[0].content[0]).to.equal('I just did not')
    expect(result[0].content[1].header).to.equal('Expect')
    expect(result[0].content[1].content[0]).to.equal('this')
    expect(result[0].content[1].content[1]).to.equal('to')
    expect(result[1].header).to.equal('Work')
    expect(result[1].content[0]).to.equal('at all...')
  })

  it('should parse three deep nested block', function () {
    const text = [
      '# To be honest',
      'I just did not',
      '## expect',
      'this to',
      '### work',
      'at all...'
    ].join('\n\n')

    result = parse(text)

    expect(result).to.eql([
      {
        header: 'To be honest',
        content: [
          'I just did not',
          {
            header: 'expect',
            content: [
              'this to',
              {
                header: 'work',
                content: [
                  'at all...'
                ]
              }
            ]
          }
        ]
      }
    ])
    expect(result[0].header).to.equal('To be honest')
    expect(result[0].content[0]).to.equal('I just did not')
    expect(result[0].content[1].header).to.equal('expect')
    expect(result[0].content[1].content[0]).to.equal('this to')
    expect(result[0].content[1].content[1].header).to.equal('work')
    expect(result[0].content[1].content[1].content[0]).to.equal('at all...')
  })
  it('should parse three deep nested block', function () {
    const text = [
      '# To be honest',
      'I just did not',
      '## expect',
      'this to',
      '### work',
      'at all...'
    ].join('\n\n')

    result = parse(text)

    expect(result).to.eql([
      {
        header: 'To be honest',
        content: [
          'I just did not',
          {
            header: 'expect',
            content: [
              'this to',
              {
                header: 'work',
                content: [
                  'at all...'
                ]
              }
            ]
          }
        ]
      }
    ])
    expect(result[0].header).to.equal('To be honest')
    expect(result[0].content[0]).to.equal('I just did not')
    expect(result[0].content[1].header).to.equal('expect')
    expect(result[0].content[1].content[0]).to.equal('this to')
    expect(result[0].content[1].content[1].header).to.equal('work')
    expect(result[0].content[1].content[1].content[0]).to.equal('at all...')
  })

  it('should parse a list block on the first level', function () {
    const text = [
      '- A bulletin thing',
      '- Hi there'
    ].join('\n\n')

    result = parse(text)

    expect(result).to.eql([
      {
        type: 'list',
        content: [
          'A bulletin thing',
          'Hi there'
        ]
      }
    ])
  })
})

# markdown-structure-to-json

Convert a markdown file or string to json, which keeps the structered elements and nesting. So far only headers (atx) and lists (\*, +, -, 1.) are recognized as structural elements. Anything else will be ignored and just passed through.

Has no dependencies.

## Example

```markdown
# Some creative title

A short but fine text.

**This bold paragraph and the following link [Example](example.com) will be just passed through.**

## Let's go deeper

### Even deeper

1. You can use numbered lists
  * Or any other markdown list format like asterisks, plus signs or dashes
  * As you see nesting list items is no problem
2. Let's wrap this up!

## No wait

Ah forget it.
```

This markdown is parsed to this JSON:

```json
[
  {
    "header": "Some creative title",
    "content": [
      "A short but fine text.",
      "**This bold paragraph and the following link [Example](example.com) will be just passed through.**",
      {
        "header": "Let's go deeper",
        "content": [
          {
            "header": "Even deeper",
            "content": [
              {
                "type": "list",
                "content": [
                  "You can use numbered lists",
                  {
                    "type": "list",
                    "content": [
                      "Or any other markdown list format like asterisks, plus signs or dashes",
                      "As you see nesting list items is no problem"
                    ]
                  },
                  "Let's wrap this up!"
                ]
              }
            ]
          }
        ]
      },
      {
        "header": "No wait",
        "content": [
          "Ah forget it."
        ]
      }
    ]
  }
]
```

## Usage

Load the javascript of the /dist directory into your HTML file:

```html
<script type="text/javascript" src="markdown-structure-to-json.min.js"></script>
```

Pass the markdown string:

```javascript
const result = markdownStructureToJson('# Hi\n\nI am a markdown document.')
```

### NPM

```shell
$ npm install carlreinecken/markdown-structure-to-json
```

```javascript
import md2json from 'markdown-structure-to-json'
```

### CLI

```shell
$ npm install -g carlreinecken/markdown-structure-to-json
```

The script reads from `stdin` and outputs to `stdout`.

```shell
$ markdown-structure-to-json < my-markdown-file.md > my-output-file.json
```

## Options

```javascript
md2json(text [, options])
```

For example:

```javascript
md2json(text {
  maxHeaderLevel: 2,
  parseLists: '.*',
  keepBlankLines: true
})
```

### maxHeaderLevel

Set the maximal header level that should be parsed as header block. E.g. `{ maxHeaderLevel: 2 }` will only parse headers with one or two `#` and pass the other ones just through.

Accepts numbers from `1` to `6`. Defaults to `6`.

### parseLists

Specifically include/exclude one of the list types. E.g. `{ parseLists: '+-' }` parses all lists with a plus sign and a dash, but passes through numbered lists or those with dashes.

Include lists with...

* asterisks `*`
* plus signs `+`
* dashes `-`
* numbers `.`

Also accepts `true` or `false` which will either parse all lists or no lists respectively. Defaults to `true`.

### keepBlankLines

Accepts `true` or `false`. Defaults to `false`.

## Development

To build run `npm run build`.

To lint run `npm run lint`.

To test run `npm test`.

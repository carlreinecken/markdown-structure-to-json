# markdown-structure-to-json

Convert a markdown file or string to json, which keeps the structered elements and nesting. So far only headers (atx) and lists (\*, +, -, 1.) are recognized as structural elements. Anything else will be ignored and just passed through as content.

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

parses to:

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

Load the javascript into your HTML file:

```html
<script type="text/javascript" src="md2json.min.js"></script>
```

Pass the markdown string:

```javascript
const result = md2json('# Hi\n\nI am a markdown document.')
```

### Node.js

```javascript
const md2json = require('md2json')

const result = md2json('# Hi\n\nI am a markdown document.')
```

### CLI

```shell
npm install -g X
```

The script reads from `stdin` and outputs to `stdout`.

```shell
md2json < my-markdown-file.md > my-output-file.json
```

## Development

To build run `npm run build`.

To lint run `npm run lint`.

To test run `npm test`.

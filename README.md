# Super Type Markup Language

Lightweight JavaScript template engine for better cleaner code.

[![Travis branch](https://img.shields.io/travis/chikara-chan/stml/master.svg)](https://travis-ci.org/chikara-chan/stml)
[![Coveralls branch](https://img.shields.io/coveralls/chikara-chan/stml/master.svg)](https://coveralls.io/github/chikara-chan/stml)
[![npm](https://img.shields.io/npm/v/stml.svg)](https://www.npmjs.com/package/stml)
[![npm](https://img.shields.io/npm/l/stml.svg)](https://github.com/chikara-chan/stml/blob/master/LICENSE)

## Install

``` bash
$ npm install stml
# Or
$ yarn add stml
```

## Usage

``` js
import fs from 'fs'
import path from 'path'
import stml from 'stml'

const src = fs.readFileSync(path.join(__dirname, 'template.html'))
const dest = stml.compile(src, {
  locals: {
    entries: ['James', 'John', 'Tom']
  },
  filename: path.join(__dirname, 'template.html')
})

console.log(dest)
```

## API

Name | Type | Default | Description
--- | --- | --- | ---
locals | Object |  | The options to pass params to template.
filename | String |  | The absolute path souce filename when extends is declared.
expressionOpen | String | '{' | Expression statement open syntax.
expressionClose | String | '}' | Expression statement close syntax.
blockOpen | String | '<%' | Block statement open syntax.
blockClose | String | '%>' | Block statement close syntax.

## Syntax

#### expression statement

Use jsx syntax for expression statement.
``` html
<div>{ name }</div> <!-- escape -->
<div>{- name }</div> <!-- unescape -->
```

#### block statement

Use jsp syntax for block statement.
``` html
<% if (entries.length) { %>
  <ul>
    <% entries.forEach(function(entry){ %>
      <li>{ entry }</li>
    <% }) %>
  </ul>
<% } %>

```

#### extends statement

Use jsp syntax for extends statement.
``` html
<% extends 'header.html' %>

```

## License

Released under the [MIT](https://github.com/chikara-chan/stml/blob/master/LICENSE) license.

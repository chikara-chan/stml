import {invariant} from 'invincible'
import path from 'path'
import fs from 'fs'

const defaultOpts = {
  expressionOpen: '{',
  expressionClose: '}',
  blockOpen: '<%',
  blockClose: '%>'
}

/**
 * Parse the source string, and return the function body.
 *
 * @param {String} str
 * @param {Object} opts
 * @return {String}
 */
function parse(str, opts = {}) {
  opts = {
    ...defaultOpts, ...opts
  }

  const blockOpen = opts.blockOpen,
    blockClose = opts.blockClose,
    expressionOpen = opts.expressionOpen,
    expressionClose = opts.expressionClose,
    filename = opts.filename

  let prefix, suffix, start, end, js, extendFilename, extendFileStr,
    buffer = []

  buffer.push('var buf = [];')
  buffer.push('with (locals || {}) {')
  buffer.push('buf.push(\'')
  for (let i = 0; i < str.length; i++) {
    if (str.slice(i, blockOpen.length + i) === blockOpen) {
      start = i + blockOpen.length
      end = str.indexOf(blockClose, start)
      invariant(~end, `Could not find blockClose tag \`${blockClose}\`.`)
      prefix = '\');'
      suffix = '; buf.push(\''
      js = str.slice(start, end).trim()
      if (js.match(/^extends\s/)) {
        invariant(filename,
          'options `filename` is required for extends')
        extendFilename = js.slice(7).trim()
        invariant(extendFilename.match(/^("|').+('|")$/),
          'extendsFilename must be wrapped with quote for extends')
        extendFilename = extendFilename.slice(1, -1)
        extendFileStr = fs.readFileSync(path.resolve(path.dirname(filename), extendFilename), 'utf8')
        extendFileStr = parse(extendFileStr, {
          filename: extendFilename,
          blockOpen,
          blockClose,
          expressionOpen,
          expressionClose
        })
        buffer.push(`' + (function(){${extendFileStr}}()) + '`)
        i = end + blockClose.length - 1
        continue
      }
      buffer.push(prefix)
      buffer.push(js)
      buffer.push(suffix)
      i = end + blockClose.length - 1
    } else if (str.slice(i, expressionOpen.length + i) === expressionOpen) {
      start = i + expressionOpen.length
      end = str.indexOf(expressionClose, start)
      invariant(~end, `Could not find expressionClose tag \`${expressionClose}\`.`)
      if (str[start] === '-') {
        prefix = '\', '
        suffix = ', \''
        start++
      } else {
        prefix = '\', escapeHTML('
        suffix = '), \''
      }
      js = str.slice(start, end).trim()
      if (js) {
        buffer.push(prefix)
        buffer.push(js)
        buffer.push(suffix)
      }
      i = end + expressionClose.length - 1
    } else if (str[i] === '\\') {
      buffer.push('\\\\')
    } else if (str[i] === '\'') {
      buffer.push('\\\'')
    } else if (str[i] === '\r') {
      // eslint-disable-line
    } else if (str[i] === '\n') {
      buffer.push('\\n')
    } else {
      buffer.push(str[i])
    }
  }
  buffer.push('\')} return buf.join(\'\');')

  return buffer.join('')
}

export default parse

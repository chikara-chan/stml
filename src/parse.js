/* @flow */

import { assert } from 'invincible'
import parseExtendFile from './parseExtendFile'

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
function parse(str: string, opts: Object = {}): string {
  opts = {
    ...defaultOpts, ...opts
  }

  const blockOpen = opts.blockOpen,
    blockClose = opts.blockClose,
    expressionOpen = opts.expressionOpen,
    expressionClose = opts.expressionClose,
    buffer = []
  let prefix, suffix, start, end, js

  buffer.push([
    'var buf = [];',
    'with (locals || {}) {',
    'buf.push(\''
  ].join('\n'))
  for (let i = 0; i < str.length; i++) {
    if (str.slice(i, blockOpen.length + i) === blockOpen) {
      start = i + blockOpen.length
      end = str.indexOf(blockClose, start)
      assert(
        ~end,
        `could not find blockClose tag \`${blockClose}\`.`
      )
      prefix = '\');'
      suffix = '; buf.push(\''
      js = str.slice(start, end).trim()
      if (js.match(/^extends\s/)) {
        parseExtendFile(js, buffer, opts)
        i = end + blockClose.length - 1
        continue
      }
      buffer.push([
        prefix,
        js,
        suffix
      ].join(''))
      i = end + blockClose.length - 1
    } else if (str.slice(i, expressionOpen.length + i) === expressionOpen) {
      start = i + expressionOpen.length
      end = str.indexOf(expressionClose, start)
      assert(
        ~end,
        `Could not find expressionClose tag \`${expressionClose}\`.`
      )
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
        buffer.push([
          prefix,
          js,
          suffix
        ].join(''))
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
  buffer.push([
    '\')}',
    'return buf.join(\'\');'
  ].join('\n'))

  return buffer.join('')
}

export default parse

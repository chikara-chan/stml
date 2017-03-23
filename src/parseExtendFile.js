import fs from 'fs'
import path from 'path'
import { assert } from 'invincible'
import parse from './parse'

/**
 * Parse the extend file
 *
 * @param {String} js
 * @param {Array} buffer
 * @param {Object} opts
 */
function parseExtendFile(js, buffer, opts) {
  const blockOpen = opts.blockOpen,
    blockClose = opts.blockClose,
    expressionOpen = opts.expressionOpen,
    expressionClose = opts.expressionClose,
    filename = opts.filename
  let extendFilename, extendFileStr

  assert(
    filename,
    'options `filename` is required for extends'
  )
  extendFilename = js.slice(7).trim(),
  assert(
    extendFilename.match(/^("|').+('|")$/),
    'extendsFilename must be wrapped with quote for extends'
  )
  extendFilename = extendFilename.slice(1, -1)
  extendFileStr = fs.readFileSync(
    path.resolve(path.dirname(filename), extendFilename),
    'utf8'
  )
  extendFileStr = parse(extendFileStr, {
    filename: extendFilename,
    blockOpen,
    blockClose,
    expressionOpen,
    expressionClose
  })
  buffer.push(`' + (function(){${extendFileStr}}()) + '`)
}

export default parseExtendFile

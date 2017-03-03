import {invariant} from 'invincible'
import parse from './parse'
import helpers from './helpers'

/**
 * Compile the source string, and return a executable function.
 *
 * @param {String} str
 * @param {Object} opts
 * @return {Function}
 */
function compile(str, opts = {}) {
  let fn, ret

  str = parse(str, opts)
  try {
    fn = new Function('locals', 'escapeHTML', str)
    ret = fn(opts.locals, helpers.escapeHTML)
  } catch (e) {
    invariant(e.name !== 'SyntaxError', 'an error occured when compiling')
    throw e
  }

  return ret
}

export default compile

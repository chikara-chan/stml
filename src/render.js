/* @flow */

import compile from './compile'

/**
 * Render the source string with options.
 *
 * @param {String} str
 * @param {Object} opts
 * @return {String}
 */
function render(str: string, opts: Object = {}): Function {
  const fn = compile(str, opts)

  return fn(opts.locals)
}

export default render

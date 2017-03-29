import { assert } from 'invincible'
import { compile } from 'stml'
import { resolve } from 'path'
import fs from 'fs'

const defaults = {
  ext: 'html'
}

/**
 * render template
 *
 * @param  {String} view - filename
 * @param  {Object} opts
 * @return {String}
 */
async function render(view, opts) {
  view += opts.ext

  const viewPath = resolve(opts.root, view)
  const src = await fs.readFile(viewPath, 'utf8')
  const dest = render(src, {
    filename: viewPath,
    locals: opts.locals
  })

  return dest
}

/**
 * set koa view engine
 *
 * @param  {Koa} app
 * @param  {Object} opts
 */
export default function(app, opts) {
  assert(opts && opts.root, 'option `root` is required')
  opts = {...defaults, ...opts}
  opts.ext += '.'
  app.context.render = async function (view, locals) {
    const html = await render(view, {
      ...opts,
      locals
    })

    this.body = html
  }
}

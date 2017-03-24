/* @flow */

/**
 * Escape html special charactor.
 *
 * @param {String} html
 */
function escapeHTML(html: string): string {
  return String(html)
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default {
  escapeHTML
}

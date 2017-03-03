function escapeHTML(html) {
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

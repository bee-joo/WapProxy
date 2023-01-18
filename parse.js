const host = process.env['host'];

export const preparePage = (html, url) => {
  return updateHref(updateSrc(html, url), url)
}

const updateHref = (html, url) => {
  return html.replace(/href="(.*?)"/g, (match, $1) => {
    if (!$1.startsWith('http') && !$1.startsWith('/')) {
      $1 = '/' + $1;
    }
    if ($1.startsWith('http')) {
      return `href="${host}/?url=${$1}"`;
    }
    return `href="${host}/?url=${url}${$1}"`;
  })
}

const updateSrc = (html, url) => {
  return html.replace(/src="(.*?)"/g, (match, $1) => {
    if (!$1.startsWith('http')) {
      return `src="${host}/img?url=${url}/${$1}"`;
    }
  })
}
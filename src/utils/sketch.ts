export const extractBackgroundColor = (code: string): string | null => {
  const bgRegex = /\/\/\s*@background\s+([#a-zA-Z0-9() ,]+)/
  const match = code.match(bgRegex)
  return match ? (match[1] ?? null) : null
}

export const extractPluginUrls = (code: string): string[] => {
  const pluginRegex = /\/\/\s*@plugin\s+(https?:\/\/[^\s]+)/g
  const urls: string[] = []
  let match

  while ((match = pluginRegex.exec(code)) !== null) {
    if (match[1]) {
      urls.push(match[1])
    }
  }

  return urls
}

export const escapeHtml = (str: string): string => {
  return str.replace(/[&<>"']/g, match => {
    const escape: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return escape[match] || match
  })
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// GFM-таблицы включены в markdown-it по умолчанию.
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const { value } = hljs.highlight(code, { language: lang, ignoreIllegals: true })
        return `<pre class="hljs"><code>${value}</code></pre>`
      } catch {
        // падаем в неподсвеченный вариант ниже
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
  }
})

export function renderMarkdown(raw: string): string {
  return md.render(raw)
}

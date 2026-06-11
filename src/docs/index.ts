// Авто-сканирование markdown-документов из этой папки.
// Каждая подпапка становится разделом сайдбара, каждый .md — документом.

export interface Doc {
  id: string // путь относительно src/docs без расширения, напр. "Extranet API/endpoint-rates"
  title: string // первый заголовок "# ..." из md, фолбэк — имя файла
  raw: string // сырое содержимое md
}

export interface Section {
  title: string // имя папки; "" для файлов в корне src/docs
  docs: Doc[]
}

const ROOT_SECTION = 'Документы'

// webpack заменит это на инлайн-контекст всех .md в src/docs (рекурсивно).
const context = require.context('./', true, /\.md$/)

function extractTitle(raw: string, fallback: string): string {
  const match = raw.match(/^\s*#\s+(.+?)\s*$/m)
  return match ? match[1].trim() : fallback
}

function buildSections(): Section[] {
  const byTitle = new Map<string, Section>()

  for (const key of context.keys()) {
    const mod = context(key)
    const raw: string = typeof mod === 'string' ? mod : mod.default

    // key вида "./Extranet API/endpoint-rates.md"
    const relPath = key.replace(/^\.\//, '').replace(/\.md$/, '')
    const parts = relPath.split('/')
    const fileName = parts[parts.length - 1]
    const sectionTitle = parts.length > 1 ? parts[parts.length - 2] : ROOT_SECTION

    const doc: Doc = {
      id: relPath,
      title: extractTitle(raw, fileName),
      raw
    }

    if (!byTitle.has(sectionTitle)) {
      byTitle.set(sectionTitle, { title: sectionTitle, docs: [] })
    }
    byTitle.get(sectionTitle)!.docs.push(doc)
  }

  const sections = Array.from(byTitle.values())
  sections.sort((a, b) => a.title.localeCompare(b.title))
  for (const section of sections) {
    section.docs.sort((a, b) => a.title.localeCompare(b.title))
  }
  return sections
}

export const sections: Section[] = buildSections()

export function findDoc(id: string): Doc | undefined {
  for (const section of sections) {
    const doc = section.docs.find((d) => d.id === id)
    if (doc) return doc
  }
  return undefined
}

export const firstDocId: string | undefined = sections[0]?.docs[0]?.id

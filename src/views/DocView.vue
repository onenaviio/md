<template>
  <div class="doc">
    <article v-if="doc" class="markdown-body" v-html="html"></article>
    <div v-else class="doc__empty">
      <h2>Документ не найден</h2>
      <p>Выберите документ в списке слева.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findDoc } from '@/docs'
import { renderMarkdown } from '@/services/markdown'
import 'highlight.js/styles/github.css'

const route = useRoute()

const doc = computed(() => findDoc(decodeURIComponent(String(route.params.id))))
const html = computed(() => (doc.value ? renderMarkdown(doc.value.raw) : ''))
</script>

<style scoped>
.doc {
  flex: 1 1 auto;
  height: 100vh;
  overflow-y: auto;
  padding: 32px 48px 80px;
  box-sizing: border-box;
  text-align: left;
}

.doc__empty {
  color: #8a94a6;
}
</style>

<!-- Стили рендеренного markdown (не scoped — контент вставляется через v-html). -->
<style>
.markdown-body {
  max-width: 880px;
  margin: 0 auto;
  color: #2c3e50;
  line-height: 1.6;
  font-size: 15px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  line-height: 1.25;
  margin: 1.6em 0 0.6em;
  font-weight: 700;
}

.markdown-body h1 {
  font-size: 1.9em;
  margin-top: 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e2e5e9;
}

.markdown-body h2 {
  font-size: 1.45em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #eef0f3;
}

.markdown-body h3 {
  font-size: 1.2em;
}

.markdown-body p,
.markdown-body ul,
.markdown-body ol,
.markdown-body blockquote {
  margin: 0.7em 0;
}

.markdown-body a {
  color: #1a6dd6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body blockquote {
  margin-left: 0;
  padding: 0.4em 1em;
  border-left: 4px solid #cfd6df;
  background: #f7f9fb;
  color: #4a5568;
}

.markdown-body code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.88em;
  background: #f0f2f5;
  padding: 0.15em 0.4em;
  border-radius: 4px;
}

.markdown-body pre {
  margin: 1em 0;
  padding: 14px 16px;
  overflow-x: auto;
  background: #f6f8fa;
  border: 1px solid #e2e5e9;
  border-radius: 8px;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.5;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
  font-size: 0.92em;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #e2e5e9;
  padding: 8px 12px;
  text-align: left;
  vertical-align: top;
}

.markdown-body th {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-body tr:nth-child(even) td {
  background: #fafbfc;
}

.markdown-body img {
  max-width: 100%;
}
</style>

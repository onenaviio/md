<template>
  <nav class="sidebar">
    <div class="sidebar__title">Документация</div>
    <div v-for="section in sections" :key="section.title" class="section">
      <button
        type="button"
        class="section__header"
        :aria-expanded="isOpen(section.title)"
        @click="toggle(section.title)"
      >
        <span class="section__caret" :class="{ 'section__caret--open': isOpen(section.title) }">▶</span>
        <span class="section__name">{{ section.title }}</span>
      </button>
      <ul v-show="isOpen(section.title)" class="section__list">
        <li v-for="doc in section.docs" :key="doc.id">
          <router-link class="doc-link" :to="`/doc/${encodeURIComponent(doc.id)}`">
            {{ doc.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { sections } from '@/docs'

export default defineComponent({
  name: 'SidebarNav',
  data() {
    return {
      // Все разделы развёрнуты по умолчанию.
      open: Object.fromEntries(sections.map((s) => [s.title, true])) as Record<string, boolean>,
      sections
    }
  },
  methods: {
    isOpen(title: string): boolean {
      return this.open[title]
    },
    toggle(title: string): void {
      this.open[title] = !this.open[title]
    }
  }
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  flex: 0 0 280px;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 16px 12px;
  border-right: 1px solid #e2e5e9;
  background: #fafbfc;
  text-align: left;
}

.sidebar__title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a94a6;
  padding: 4px 8px 12px;
}

.section {
  margin-bottom: 4px;
}

.section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  border-radius: 6px;
  text-align: left;
}

.section__header:hover {
  background: #eef0f3;
}

.section__caret {
  font-size: 9px;
  color: #8a94a6;
  transition: transform 0.15s ease;
}

.section__caret--open {
  transform: rotate(90deg);
}

.section__list {
  list-style: none;
  margin: 2px 0 8px;
  padding: 0 0 0 22px;
}

.doc-link {
  display: block;
  padding: 6px 10px;
  font-size: 13.5px;
  color: #4a5568;
  text-decoration: none;
  border-radius: 6px;
  line-height: 1.35;
}

.doc-link:hover {
  background: #eef0f3;
  color: #2c3e50;
}

.doc-link.router-link-active {
  background: #e7f0fe;
  color: #1a6dd6;
  font-weight: 600;
}
</style>

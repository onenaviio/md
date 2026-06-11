<template>
  <div class="layout">
    <SidebarNav />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SidebarNav from '@/components/SidebarNav.vue'

export default defineComponent({
  name: 'App',
  components: { SidebarNav }
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.layout {
  display: flex;
  align-items: stretch;
  height: 100vh;
}
</style>

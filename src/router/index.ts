import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DocView from '../views/DocView.vue'
import { firstDocId } from '../docs'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: firstDocId ? `/doc/${encodeURIComponent(firstDocId)}` : '/doc/'
  },
  {
    path: '/doc/:id',
    name: 'doc',
    component: DocView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

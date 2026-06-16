import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('@/views/PigeonList.vue'),
    },
    {
      path: '/overview',
      name: 'overview',
      component: () => import('@/views/Overview.vue'),
    },
    {
      path: '/pigeon/:id',
      name: 'detail',
      component: () => import('@/views/PigeonDetail.vue'),
    },
    {
      path: '/race-results',
      name: 'raceResults',
      component: () => import('@/views/RaceResultList.vue'),
    },
    {
      path: '/pairing-summary',
      name: 'pairingSummary',
      component: () => import('@/views/PairingSummary.vue'),
    },
  ],
})

export default router

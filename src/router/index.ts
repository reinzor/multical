import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Last from '@/views/Last.vue';
import History from '@/views/History.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Last',
    component: Last,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

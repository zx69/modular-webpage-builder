import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Builder from '../views/builder/index.vue';
import ModuleEditor from '../views/moduleEditor/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'home',
    redirect: '/builder',
    children: [
      {
        path: '/builder',
        name: 'builder',
        component: () => import('@/views/builder/index.vue'),
      },
      {
        path: '/moduleEditor',
        name: 'moduleEditor',
        component: () => import('@/views/moduleEditor/index.vue'),
      },
    ],
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

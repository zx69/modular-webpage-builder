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
        component: Builder,
      },
      {
        path: '/moduleEditor',
        name: 'moduleEditor',
        component: ModuleEditor,
      },
    ],
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

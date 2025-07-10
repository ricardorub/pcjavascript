

import { Home } from '../vistas/home.vue';
import { AcercaDe } from '../vistas/Acercade.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: AcercaDe }
];

// Org. Jorge Chicana

const router = createRouter ({
  history: createWebHistory(),
  routes
})

export default router;

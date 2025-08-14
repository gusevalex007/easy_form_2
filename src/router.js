
import { createRouter, createWebHistory } from 'vue-router';
import App_cars from './App_cars.vue';
import App_cars_timeline from './App_cars_timeline.vue';
import App_cars_request from './App_cars_request.vue';

const routes = [
  {
    path: '/available-cars',
    name: 'AvailableCars',
    component: App_cars,
  },
  {
    path: '/car-requests',
    name: 'CarRequests',
    component: App_cars_timeline,
  },
  {
    path: '/new-request',
    name: 'NewRequest',
    component: App_cars_request,
  },
  {
    path: '/',
    redirect: '/available-cars'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

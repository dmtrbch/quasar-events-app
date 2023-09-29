import { RouteRecordRaw } from 'vue-router';
import { useEventsStore } from 'src/stores/events-store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'HomePage',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        name: 'RegisterPage',
        path: '',
        component: () => import('pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        name: 'LoginPage',
        path: '',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/events',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        name: 'EventsPage',
        path: '',
        component: () => import('pages/EventsPage.vue'),
      },
      {
        name: 'EventCreate',
        path: 'create',
        component: () => import('pages/EventCreate.vue'),
      },
      {
        name: 'EventEdit',
        path: 'edit/:id',
        component: () => import('pages/EventEdit.vue'),
        props: true,
        async beforeEnter(to, from, next) {
          if (useEventsStore().events.length) {
            next();
          } else {
            // fetch events - needed in case of page refresh
            await useEventsStore().fetchEvents();
            next();
          }
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

import Board from '@/views/Board.vue';
import Boards from '@/views/Boards.vue';
import Invite from '@/views/Invite.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import TaskEdit from '@/views/TaskEdit.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { preventIfLoggedIn: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { preventIfLoggedIn: true },
  },
  {
    path: '/invite/:inviteId',
    name: 'Invite',
    component: Invite,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Boards',
    component: Boards,
    meta: { requiresAuth: true },
  },
  {
    path: '/board/:boardId',
    name: 'Board',
    component: Board,
    props: true,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'task/:taskId',
        name: 'Task',
        component: TaskEdit,
        props: true,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('userData');

  if (to.matched.some((route) => route.meta.requiresAuth) && !loggedIn) {
    next('/login');
  }

  if (to.matched.some((route) => route.meta.preventIfLoggedIn) && loggedIn) {
    next('/');
  }

  next();
});

export default router;

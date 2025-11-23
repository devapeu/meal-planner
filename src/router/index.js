import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecipesView from '@/views/RecipesView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import { useAuthStore } from '@/stores/useAuth';

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'home',
    meta: { title: 'Home', requiresAuth: true }
  },
  {
    path: '/recipes',
    component: RecipesView,
    name: 'recipes',
    meta: { title: 'Recipes', requiresAuth: true }
  },
  {
    path: '/login',
    component: LoginView,
    name: 'login',
    meta: { title: 'Login', requiresGuest: true }
  },
  {
    path: '/register',
    component: RegisterView,
    name: 'register',
    meta: { title: 'Register', requiresGuest: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.getCurrentUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;

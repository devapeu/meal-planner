import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecipesListView from '@/views/RecipesListView.vue';

const routes = [
  { path: '/', component: HomeView, name: 'home', meta: { title: 'Home' } },
  { path: '/recipes', component: RecipesListView, name: 'recipes', meta: { title: 'Recipes' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

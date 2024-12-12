import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecipesListView from '@/views/RecipesListView.vue';
import RecipesSingleView from '@/views/RecipesSingleView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/recipes', component: RecipesListView },
  { path: '/recipes/:id', component: RecipesSingleView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

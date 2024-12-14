import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RecipesListView from '@/views/RecipesListView.vue';
import RecipesSingleView from '@/views/RecipesSingleView.vue';
import RecipesNewView from '@/views/RecipesNewView.vue';

const routes = [
  { path: '/', component: HomeView, name: 'home', meta: { title: 'Home' } },
  { path: '/recipes', component: RecipesListView, name: 'recipes', meta: { title: 'Recipes' } },
  { path: '/recipes/:id', component: RecipesSingleView, name: 'recipes-single' },
  { path: '/recipes/new', component: RecipesNewView, name: 'recipes-new', meta: { title: 'New Recipe' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

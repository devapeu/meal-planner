<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, computed } from 'vue'
import ShoppingList from '@/components/ShoppingList.vue';
import MealCalendar from '@/components/MealCalendar.vue'
import { useRecipesStore } from '@/stores/useRecipes'

const recipesStore = useRecipesStore()

const recipes = computed(() => recipesStore.recipes)

onMounted(() => {
  recipesStore.get()
})
</script>

<template>
  <main class="home-grid">
    <div class="home-grid__meal-calendar">
      <h2>Weekly Meals</h2>
      <MealCalendar />
    </div>
    <div class="home-grid__shopping-list">
      <ShoppingList />
    </div>
    <div class="home-grid__recipes">
      <h2>Recipes</h2>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id">
          <RouterLink :to="`/recipes/${recipe.id}`">
            <p>{{ recipe.name }}</p>
          </RouterLink>
        </li>
      </ul>
      <RouterLink to="recipes/">See recipes</RouterLink>
    </div>
  </main>
</template>

<style lang="sass" scoped>
.home-grid
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1rem
  max-width: 1140px
  margin: 0 auto
  @media (max-width: 768px)
    display: grid
    grid-template-columns: 1fr
    .home-grid__meal-calendar
      grid-column: auto
  &__meal-calendar
    grid-column: 1 / span 2
</style>

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
      <MealCalendar />
    </div>
    <div class="home-grid__shopping-list">
      <ShoppingList />
    </div>
    <div class="home-grid__recipes">
      <div class="recipes-wrapper">
        <h2>Recipes</h2>
        <ul>
          <li v-for="recipe in recipes" :key="recipe.id">
            <RouterLink :to="`/recipes/${recipe.id}`">
              {{ recipe.name }}
            </RouterLink>
          </li>
        </ul>
        <RouterLink to="recipes/">See recipes</RouterLink>
      </div>
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

.recipes-wrapper
  display: flex
  flex-direction: column
  gap: 12px
  padding: 16px
  border-radius: 8px
  background: white
  ul
    margin: 0
</style>

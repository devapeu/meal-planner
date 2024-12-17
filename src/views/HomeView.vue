<script setup>
import ShoppingList from '@/components/shoppingList/ShoppingList.vue';
import MealCalendar from '@/components/calendar/MealCalendar.vue'
import RecipesList from '@/components/recipes/RecipesList.vue'
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
      <RecipesList />
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
    .home-grid__shopping-list
      order: -1
  &__meal-calendar
    grid-column: 1 / span 2
</style>

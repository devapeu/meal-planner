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
  </main>
</template>

<style lang="sass" scoped>
.home-grid
  display: grid
  grid-template-columns: 2fr 1fr
  gap: 1rem
  max-width: 1280px
  margin: 0 auto
  padding: 1rem
  @media (max-width: 768px)
    display: grid
    gap: 0.5rem
    padding: 0.5rem
    grid-template-columns: 1fr
    .home-grid__meal-calendar
      grid-column: auto
    .home-grid__shopping-list
      order: -1
</style>

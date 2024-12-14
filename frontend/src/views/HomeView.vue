<script setup>
import { RouterLink } from 'vue-router'
import ShoppingList from '@/components/ShoppingList.vue';
import MealCalendar from '@/components/MealCalendar.vue'
</script>

<template>
  <main class="home-grid">
    <div class="home-grid__meal-calendar">
      <h2>Weekly Meals</h2>
      <MealCalendar />
    </div>
    <div class="home-grid__shopping-list">
      <h2>Shopping List</h2>
      <ShoppingList />
    </div>
    <div class="home-grid__recipes">
      <h2>Recipes</h2>
      <RouterLink to="recipes/">See recipes</RouterLink>
    </div>
  </main>
</template>

<style lang="sass" scoped>
.home-grid
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1rem
  &__meal-calendar
    grid-column: 1 / span 2
</style>

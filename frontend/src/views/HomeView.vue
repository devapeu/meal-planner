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
      <div class="shopping-list-wrapper">
        <h2>Shopping List</h2>
        <ShoppingList />
      </div>
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
  @media (max-width: 768px)
    display: grid
    grid-template-columns: 1fr
    .home-grid__meal-calendar
      grid-column: auto
  &__meal-calendar
    grid-column: 1 / span 2

.shopping-list-wrapper
  background: #fff
  display: flex
  flex-direction: column
  gap: 8px
  padding: 20px
  h2
    margin: 0
</style>

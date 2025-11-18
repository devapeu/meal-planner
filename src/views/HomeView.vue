<script setup>
import ShoppingList from '@/components/shoppingList/ShoppingList.vue';
import MealCalendar from '@/components/calendar/MealCalendar.vue'
</script>

<template>
  <div class="home">
    <header class="home-header">
      <h1>Meal Planner</h1>
      <p>What will I cook today?</p>
    </header>
    <main class="home-grid">
      <div class="home-grid__meal-calendar">
        <MealCalendar />
      </div>
      <div class="home-grid__shopping-list">
        <ShoppingList />
      </div>
    </main>
  </div>
</template>

<style lang="sass" scoped>
.home
  margin: 0 auto
  padding: 1rem
  @media (min-width: 1280px)
    padding: 1rem 3rem

.home-header
  display: grid
  gap: 4px
  h1, p
    margin: 0
.home-grid
  display: grid
  grid-template-columns: 2fr 1fr
  gap: 1rem
  @media (max-width: 1024px)
    display: grid
    grid-template-columns: 1fr
    gap: 0.5rem
  @media (max-width: 768px)
    .home-grid__meal-calendar
      grid-column: auto
    .home-grid__shopping-list
      order: -1
</style>

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
  max-width: 1280px
  margin: 0 auto
  padding: 1rem

.home-header
  display: grid
  gap: 4px
  h1, p
    margin: 0
.home-grid
  display: grid
  grid-template-columns: 2fr 1fr
  gap: 1rem
  @media (max-width: 768px)
    display: grid
    gap: 0.5rem
    grid-template-columns: 1fr
    .home-grid__meal-calendar
      grid-column: auto
    .home-grid__shopping-list
      order: -1
</style>

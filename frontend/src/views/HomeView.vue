<script setup>
import { RouterLink } from 'vue-router'
import ShoppingList from '@/components/ShoppingList.vue';
import MealCalendar from '@/components/MealCalendar.vue'
</script>

<template>
  <main>
    <h1>Meal Planner :3</h1>
    <h2>Weekly Meals</h2>
    <MealCalendar />
    <h2>Shopping List</h2>
    <ShoppingList />
    <RouterLink to="recipes/">See recipes</RouterLink>
  </main>
</template>

<style></style>
<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRecipesStore } from '@/stores/useRecipes'

const recipesStore = useRecipesStore()

const recipes = computed(() => recipesStore.recipes)

onMounted(() => {
  recipesStore.get()
})
</script>

<template>
  <main>
    <ul>
      <li v-for="recipe in recipes" :key="recipe.id">
        <RouterLink :to="`/recipes/${recipe.id}`">
          <h2>{{ recipe.name }}</h2>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/recipes/new">
          <h2>New Recipe</h2>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>
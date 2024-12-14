<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const recipes = ref([]);

onMounted(() => {
  fetch('http://localhost:8000/recipes')
    .then(response => response.json())
    .then(data => recipes.value = data.recipes)
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
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const recipe = ref({})
const ingredients = ref([])

watch(recipe, () => {
  ingredients.value = recipe.value.ingredients.split(',') || []
})

onMounted(() => {
  fetch(`http://localhost:8000/recipes/${route.params.id}`)
    .then(response => response.json())
    .then(data => recipe.value = data.recipe)
    .catch(error => console.error('Error:', error));
})
</script>

<template>
  <main>
    <h1>{{ recipe.name }}</h1>
    <ul>
      <li v-for="ingredient in ingredients" :key="ingredient">
        {{ ingredient }}
      </li>
    </ul>
    <p>Instructions: {{ recipe.instructions }}</p>
  </main>
</template>

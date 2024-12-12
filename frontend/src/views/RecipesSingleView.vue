<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const recipe = ref({})
const ingredients = ref([])

watch(recipe, () => {
  ingredients.value = recipe.value.ingredients.split(',') || []
})

function addToShoppingList(ingredient) {
  fetch('http://localhost:8000/shopping-list', {
    method: 'POST',
    body: JSON.stringify({ item: ingredient })
  })
}

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
        <button @click="addToShoppingList(ingredient)">Add to shopping list</button>
      </li>
    </ul>
    <p>Instructions: {{ recipe.instructions }}</p>
  </main>
</template>

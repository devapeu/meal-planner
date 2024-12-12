<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShoppingListStore } from '../stores/useShoppingList'

const route = useRoute()
const shoppingListStore = useShoppingListStore();

const recipe = ref({})
const ingredients = ref([])
const shoppingList = ref([])

watch(recipe, () => {
  ingredients.value = recipe.value.ingredients.split(',') || []
})

function addToShoppingList(ingredient) {
  shoppingListStore.add(ingredient)
}

function ingredientIsInShoppingList(ingredient) {
  return shoppingList.value.some(item => item.item === ingredient)
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
        <span v-if="ingredientIsInShoppingList(ingredient)">🛒</span>
        {{ ingredient }}
        <button @click="addToShoppingList(ingredient)">Add to shopping list</button>
      </li>
    </ul>
    <p>Instructions: {{ recipe.instructions }}</p>
  </main>
</template>

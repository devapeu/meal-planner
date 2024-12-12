<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShoppingListStore } from '../stores/useShoppingList'

const route = useRoute()
const shoppingListStore = useShoppingListStore();
const shoppingList = computed(() => shoppingListStore.shoppingList);

const recipe = ref({})
const ingredients = ref([])

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
  shoppingListStore.get();
})
</script>

<template>
  <main>
    <h1>{{ recipe.name }}</h1>
    <h2>Ingredients</h2>
    <ul>
      <li v-for="ingredient in ingredients" :key="ingredient">
        <span v-if="ingredientIsInShoppingList(ingredient)">🛒</span>
        {{ ingredient }}
        <button 
          v-if="!ingredientIsInShoppingList(ingredient)" 
          @click="addToShoppingList(ingredient)">Add to shopping list
        </button>
      </li>
    </ul>
    <h2>Instructions</h2>
    <p>{{ recipe.instructions }}</p>
  </main>
</template>

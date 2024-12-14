import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const currentRecipe = ref({});

  function get() {
    fetch('http://localhost:8000/recipes')
      .then(response => response.json())
      .then(data => recipes.value = data.recipes)
  }

  function getSingle(id) {
    fetch(`http://localhost:8000/recipes/${id}`)
      .then(response => response.json())
      .then(data => currentRecipe.value = data.recipe)
  }

  function add(recipe) {
    fetch('http://localhost:8000/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(data => recipes.value = data.recipes)
  }

  function remove(id) {
    fetch(`http://localhost:8000/recipes/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => recipes.value = data.recipes)
  }

  return { recipes, currentRecipe, get, getSingle, add, remove }
})
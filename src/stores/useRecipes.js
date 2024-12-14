import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const currentRecipe = ref({});

  function get() {
    fetch(`${VITE_API_URL}/recipes`)
      .then(response => response.json())
      .then(data => recipes.value = data.recipes)
  }

  function getSingle(id) {
    fetch(`${VITE_API_URL}/recipes/${id}`)
      .then(response => response.json())
      .then(data => currentRecipe.value = {...data.recipe, ingredients: data.recipe.ingredients.split(',')})
  }

  function add(recipe) {
    fetch(`${VITE_API_URL}/recipes`, {
      method: 'POST',
      body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(data => recipes.value = data.recipes)
  }

  function remove(id) {
    fetch(`${VITE_API_URL}/recipes/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => recipes.value = data.recipes)
  }

  return { recipes, currentRecipe, get, getSingle, add, remove }
})
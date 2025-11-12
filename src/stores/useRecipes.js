import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const currentRecipe = ref({});

  function transformRecipe(recipe) {
    return {
      ...recipe,
      ingredients: recipe.ingredients.split(',')
    }
  }

  function get() {
    fetch(`${VITE_API_URL}/recipes`)
      .then(response => response.json())
      .then(data => recipes.value = data.recipes)
  }

  function getSingle(id) {
    fetch(`${VITE_API_URL}/recipes/${id}`)
      .then(response => response.json())
      .then(data => currentRecipe.value = transformRecipe(data.recipe))
  }

  function add(recipe) {
    const formattedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.join(',')
    }

    fetch(`${VITE_API_URL}/recipes`, {
      method: 'POST',
      body: JSON.stringify(formattedRecipe)
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

  function update(id, recipe) {
    const formattedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.join(',')
    }

    fetch(`${VITE_API_URL}/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedRecipe)
    })
    .then(response => response.json())
    .then(data => {
      recipes.value = data.recipes
      currentRecipe.value = transformRecipe(data.recipes.find(recipe => recipe.id === id))
    })
  }

  return { recipes, currentRecipe, get, getSingle, add, remove, update }
})
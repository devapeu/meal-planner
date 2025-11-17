import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Parser } from '@devapeu/cooklang-parser'

import { Recipe, FullRecipe } from '@/types/recipe'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const currentRecipe = ref<FullRecipe | null>(null);

  function get() {
    fetch(`${VITE_API_URL}/recipes`)
      .then(response => response.json())
      .then(data => recipes.value = data.recipes)
  }

  function getSingle(id) {
    fetch(`${VITE_API_URL}/recipes/${id}`)
      .then(response => response.json())
      .then(data => {
        let parsedContent = Parser(data.recipe.content);
        currentRecipe.value = {
          id: data.recipe.id,
          name: data.recipe.name, 
          content: data.recipe.content, 
          ...parsedContent
        };
      })
  }

  function add(recipe) {
    fetch(`${VITE_API_URL}/recipes`, {
      method: 'POST',
      body: JSON.stringify({...recipe})
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
    fetch(`${VITE_API_URL}/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({...recipe})
    })
    .then(response => response.json())
    .then(data => {
      recipes.value = data.recipes

      let updatedRecipe = data.recipes.find(r => r.id === id);

      currentRecipe.value = {
        id: updatedRecipe.id,
        name: updatedRecipe.name,
        content: updatedRecipe.content,
        ...(Parser(updatedRecipe.content))
      };
    })
  }

  return { recipes, currentRecipe, get, getSingle, add, remove, update }
})
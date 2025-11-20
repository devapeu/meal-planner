import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Parser } from '@devapeu/cooklang-parser'
import { Recipe, FullRecipe, ListRecipesResponse, SingleRecipeResponse } from '@/types/recipe'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const currentRecipe = ref<FullRecipe | null>(null);

  function get() {
    fetch(`${VITE_API_URL}/recipes`)
      .then(response => response.json())
      .then(data => recipes.value = data.recipes)
  }

  function getSingle(id: number) {
    fetch(`${VITE_API_URL}/recipes/${id}`)
      .then(async response => {
        const data: SingleRecipeResponse = await response.json()
        const parsed = Parser(data.recipe.content)
        currentRecipe.value = {
          id: data.recipe.id,
          name: data.recipe.name,
          content: data.recipe.content,
          ...parsed
        }
      })
  }

  function add(recipe: Recipe) {
    fetch(`${VITE_API_URL}/recipes`, {
      method: 'POST',
      body: JSON.stringify({...recipe}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(async response => {
      const data: ListRecipesResponse = await response.json();
      recipes.value = data.recipes;
    });
  }

  function remove(id: number) {
    fetch(`${VITE_API_URL}/recipes/${id}`, {
      method: 'DELETE'
    })
    .then(async response => {
      const data: ListRecipesResponse = await response.json();
      recipes.value = data.recipes;
    });
  }

  function update(id: number, recipe: Recipe) {
    fetch(`${VITE_API_URL}/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({...recipe}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(async response => {
      const data: ListRecipesResponse = await response.json();
      recipes.value = data.recipes

      let updatedRecipe: Recipe = data.recipes.find(r => r.id === id);

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
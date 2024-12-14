<script setup>
import { computed, onMounted } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import RecipesForm from '@/components/recipes/RecipesForm.vue'
import RecipeSingle from '@/components/recipes/RecipeSingle.vue'

const recipesStore = useRecipesStore()
const recipes = computed(() => recipesStore.recipes)

const slideoutStore = useSlideoutStore()

function openRecipes(id) {
  slideoutStore.open(RecipeSingle, { id })
}

function addRecipe() {
  slideoutStore.open(RecipesForm)
}

onMounted(() => {
  recipesStore.get()
})
</script>

<template>
  <div class="recipes-wrapper">
    <h2>Recipes</h2>
    <ul class="recipes-list">
      <li 
        v-for="recipe in recipes" 
        :key="recipe.id"
        class="recipes-list__item"
        @click="openRecipes(recipe.id)">
        {{ recipe.name }}
      </li>
    </ul>
    <button @click="addRecipe()">Add Recipe</button>
  </div>
</template>

<style lang="sass">
@use '@/assets/variables' as v

.recipes-wrapper
  display: flex
  flex-direction: column
  gap: 12px
  padding: 20px
  border-radius: 8px
  background: white
  ul
    margin: 0

.recipes-list
  &__item
    cursor: pointer
    @media (pointer: fine)
      &:hover
        color: v.$accent
</style>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import RecipesForm from '@/components/recipes/RecipesForm.vue'
import RecipeSingle from '@/components/recipes/RecipeSingle.vue'

const recipesStore = useRecipesStore()
const recipes = computed(() => recipesStore.recipes)
const search = ref('')
const slideoutStore = useSlideoutStore()

const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => recipe.name.toLowerCase().includes(search.value.toLowerCase()))
})

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
    <div class="recipes-header">
      <h2>Recipes</h2>
      <input type="text" v-model="search" placeholder="Search" />
    </div>
    <ul class="recipes-list">
      <li 
        v-for="recipe in filteredRecipes" 
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

.recipes-header
  display: flex
  justify-content: space-between
  align-items: center
  input
    width: 100%
    max-width: 200px
    border: 1px solid v.$background

.recipes-list
  &__item
    cursor: pointer
    @media (pointer: fine)
      &:hover
        color: v.$accent
</style>
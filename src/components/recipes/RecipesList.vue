<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import RecipesSingleSlideout from '@/components/slideouts/RecipesSingleSlideout.vue'
import RecipesFormSlideout from '@/components/slideouts/RecipesFormSlideout.vue'

const recipesStore = useRecipesStore()
const slideoutStore = useSlideoutStore()

const recipes = computed(() => recipesStore.recipes)

const sortBy = ref<string>('name')
const search = ref<string>('')
const sortedRecipes = computed(() => {
  return recipes.value.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a.id - b.id
  })
})

const filteredRecipes = computed(() => {
  return sortedRecipes.value.filter(recipe => recipe.name.toLowerCase().includes(search.value.toLowerCase()))
})

function openRecipes(id) {
  slideoutStore.open(RecipesSingleSlideout, { id });
}

function addRecipe() {
  slideoutStore.open(RecipesFormSlideout)
}

onMounted(() => {
  recipesStore.get()
})
</script>

<template>
  <div class="recipes-wrapper">
    <div class="recipes-header">
      <h2>Recipes</h2>
      <div class="recipes-header__actions">
        <select v-model="sortBy">
          <option value="name">Sort by Name</option>
          <option value="created_at">Sort by Date Added</option>
        </select>
        <input type="text" v-model="search" placeholder="Search" />
      </div>
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
  border: 1px solid v.$background-200
  ul
    margin: 0

.recipes-header
  display: flex
  justify-content: space-between
  align-items: center
  flex-wrap: wrap
  gap: 12px
  &__actions
    display: flex
    gap: 12px
    @media (max-width: 768px)
      width: 100%
  select
    border: 1px solid v.$background
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
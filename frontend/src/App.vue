<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/useRecipes'

const route = useRoute()
const recipesStore = useRecipesStore()

const location = computed(() => {
  const urls = {
    'home': null,
    'recipes': '/',
    'recipes-single': '/recipes',
    'recipes-new': '/recipes',
  }
  return urls[route.name];
})

const title = computed(() => {
  return route.name === 'recipes-single' ? recipesStore.currentRecipe.name : route.meta.title;
})
</script>

<template>
  <main>
    <header>
      <RouterLink 
        v-if="location"
        :to="location" 
        v-slot="{ navigate }">
        <button @click="navigate">Back</button>
      </RouterLink>
      <h1>{{ title }}</h1>
    </header>
    <RouterView />
  </main>
</template>

<style lang="sass">
header
  display: flex
  align-items: center
  h1
    margin: 0
</style>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import SlideOut from '@/components/interface/SlideOut.vue'

const route = useRoute()
const recipesStore = useRecipesStore()
const slideoutStore = useSlideoutStore()

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
      <h1 style="display: none">{{ title }}</h1>
    </header>
    <RouterView />
    <SlideOut v-if="slideoutStore.isOpen" />
  </main>
</template>

<style lang="sass">
header
  display: flex
  align-items: center
  gap: 8px
  h1
    margin: 0
</style>
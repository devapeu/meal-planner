<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import { NDrawer, NDrawerContent } from 'naive-ui'

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
    <n-drawer
      v-model:show="slideoutStore.isOpen"
      placement="right"
      width="clamp(auto, 100%, 480px)"
      class="slideout"
      :mask-closable="true">
      <n-drawer-content>
        <template #header>
          <div class="slideout__header">
            {{ slideoutStore.header }}
          </div>
        </template>
        <component
          v-if="slideoutStore.component"
          :is="slideoutStore.component"
          v-bind="slideoutStore.props"
          @close="slideoutStore.close" />
      </n-drawer-content>
    </n-drawer>
  </main>
</template>

<style lang="sass">
#app
  padding: 0.5rem
  @media (min-width: 768px)
    padding: 1rem
header
  display: flex
  align-items: center
  gap: 8px
  h1
    margin: 0
.slideout
  &__header
    font-size: 24px
</style>
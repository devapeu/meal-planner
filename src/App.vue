<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import { NDrawer, NDrawerContent } from 'naive-ui'
import { Bbq, Calendar, OrganicFood } from '@iconoir/vue'

const route = useRoute()
const recipesStore = useRecipesStore()
const slideoutStore = useSlideoutStore()  

const title = computed(() => {
  return route.name === 'recipes-single' ? recipesStore.currentRecipe.name : route.meta.title;
})
</script>

<template>
  <nav class="navigation">
    <a href="/"><OrganicFood /></a>
    <ul>
      <li><router-link to="/"><Calendar width="32" height="32"/></router-link></li>
      <li><router-link to="/recipes"><Bbq width="32" height="32"/></router-link></li>
    </ul>
  </nav>
  <RouterView class="router-view" />
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
      <template #footer>
        <button @click="slideoutStore.close">Close</button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="sass">
@use '@/assets/variables' as *
#app
  min-height: 100svh
  @media (min-width: 768px)
    display: grid
    grid-template-columns: auto 1fr
.navigation
  background: $background
  padding: 8px
  ul
    list-style: none
    padding: 0
    display: grid
    gap: 8px
    a
      height: 50px
      border-radius: 5px
      display: block
      padding: 8px
      color: inherit
      @media (pointer: fine)
        &:hover
          background-color: $background-200
.router-view
  overflow-y: scroll
  max-height: 100vh

header
  display: flex
  align-items: center
  gap: 8px
  h1
    margin: 0
.slideout
  max-width: 480px
  background: $cream
  &__header
    font-size: 24px
</style>
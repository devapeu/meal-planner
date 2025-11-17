<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRecipesStore } from '../stores/useRecipes'
import { useSlideoutStore } from '../stores/useSlideout'
import { Expand, Collapse, IconoirProvider } from '@iconoir/vue'
import RecipesSingle from '@/components/recipes/RecipesSingle.vue'
import RecipesSingleSlideout from '@/components/slideouts/RecipesSingleSlideout.vue'
import { Recipe, FullRecipe } from '@/types/recipe'

const recipesStore = useRecipesStore()  
const slideoutStore = useSlideoutStore()

const expand = ref<boolean>(false)
const recipes = computed<Recipe[]>(() => recipesStore.recipes);
const currentRecipe = computed<FullRecipe | null>(() => recipesStore.currentRecipe);

function toggleExpand() {
  expand.value = !expand.value
}

function handleSelectRecipe(id: number) {
  if (window.innerWidth < 768) {
    slideoutStore.open(RecipesSingleSlideout, { id });
  }
  recipesStore.getSingle(id);
}

onMounted(() => {
  recipesStore.get()
})
</script>

<template>
  <div class="recipes-page" :class="{ expanded: expand }">
    <aside class="recipes-panel" aria-hidden="false">
      <header class="recipes-panel__top">
        <h1>Recipes</h1>
      </header>

      <div class="recipes-panel__list">
        <ul>
          <li 
            v-for="recipe in recipes" 
            :key="recipe.id" 
            class="recipe-item"
            :class="{ 'recipe-item--active': currentRecipe?.name === recipe.name }"
            @click="handleSelectRecipe(recipe.id)">
            <div class="recipe-thumb">{{ recipe.name.charAt(0) }}</div>
            <div class="recipe-meta">
              <div class="recipe-name">{{ recipe.name }}</div>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <section class="detail-panel" :class="{ full: expand }">
      <div class="detail-header">
        <div class="detail-actions">
          <button 
            v-if="currentRecipe?.name"
            class="toggle-expand-button"
            @click="toggleExpand">
            <IconoirProvider>
              <component :is="expand ? Collapse : Expand" />
            </IconoirProvider>
          </button>
        </div>
      </div>

      <div class="detail-body">
          <template v-if="currentRecipe?.name">
            <RecipesSingle 
              :recipe="currentRecipe" 
              :showTitle="true" 
              class="detail-recipe"
              :class="{ expanded: expand }"/>
          </template>
          <template v-else>
            <div class="detail-empty">Select a recipe to view details</div>
          </template>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.recipes-page
  display: grid
  grid-template-columns: 360px 1fr
  overflow: hidden
  transition: grid-template-columns 0.2s ease

  @media (max-width: 768px)
    grid-template-columns: auto

  &.expanded
    grid-template-columns: 0 1fr
    .recipes-panel
      width: 0
      overflow: hidden

.recipes-panel
  background: $cream
  border-right: 1px solid $background-200
  display: flex
  flex-direction: column
  overflow: scroll
  transition: width 100ms linear

  &__top
    padding: 16px
    border-bottom: 1px solid $background-200

  .recipes-brand
    display: flex
    align-items: center
    gap: 12px

    &__thumb
      width: 44px
      height: 44px
      border-radius: 8px
      display: flex
      align-items: center
      justify-content: center
      background: $accent
      color: white
      font-weight: 700

    &__title
      font-weight: 700
      font-size: 16px

  &__list
    padding: 12px
    overflow-y: auto
    flex: 1

    ul
      list-style: none
      margin: 0
      padding: 0

      .recipe-item
        margin-bottom: 10px
        display: flex
        gap: 12px
        padding: 10px
        border-radius: 8px
        text-decoration: none
        color: inherit
        align-items: center
        transition: background 0.12s ease, transform 0.12s ease
        cursor: pointer

        &:hover
          background: $background-200

        &--active
          background: $background

        .recipe-thumb
          width: 44px
          height: 44px
          border-radius: 6px
          background: $background
          display: flex
          align-items: center
          justify-content: center
          font-weight: 700

        .recipe-meta
          .recipe-name
            font-weight: 600
          .recipe-sub
            font-size: 12px
            color: $background-300

    .recipes-panel__new
      width: calc(100% - 24px)
      margin: 12px

.detail-panel
  padding: 24px
  overflow-y: auto
  background: white
  display: flex
  flex-direction: column

  @media (max-width: 768px)
    display: none

.detail-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 16px

.detail-title
  font-size: 22px
  font-weight: 700

.detail-body
  flex: 1
  
.detail-recipe
  &.expanded
    display: grid
    grid-template-columns: 1fr 2fr
    gap: 48px
    font-size: 20px
    max-width: 1280px
    margin: 0 auto

.toggle-expand-button
  min-width: unset
  width: 42px
  height: 42px
  display: flex
  align-items: center
  justify-content: center
  border-radius: 99px
  padding: 0

</style>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { Expand, Collapse, Minus } from '@iconoir/vue'
import RecipeSingle from '@/components/recipes/RecipeSingle.vue'

const recipesStore = useRecipesStore()

const expand = ref(false)
const recipes = computed(() => recipesStore.recipes)
const selectedId = ref(null);

function toggleExpand() {
  expand.value = !expand.value
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
            :class="{ 'recipe-item--active': selectedId === recipe.id }"
            @click="selectedId = recipe.id">
            <div class="recipe-thumb">{{ recipe.name.charAt(0) }}</div>
            <div class="recipe-meta">
              <div class="recipe-name">{{ recipe.name }}</div>
              <div class="recipe-sub">{{ (recipe.ingredients || '').split(',').slice(0,3).join(', ') }}</div>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <section class="detail-panel" :class="{ full: expand }">
      <div class="detail-header">
        <div class="detail-actions">
          <button 
            class="toggle-expand-button"
            @click="toggleExpand">
            <component :is="expand ? Collapse : Expand" />
          </button>
        </div>
      </div>

      <div class="detail-body">
          <template v-if="selectedId">
            <RecipeSingle :id="selectedId" :showTitle="true" />
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
  max-height: 100vh
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
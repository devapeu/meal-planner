<script setup lang="ts">
import { computed } from 'vue'
import { useShoppingListStore } from '@/stores/useShoppingList'
import { Cart, Check, IconoirProvider } from '@iconoir/vue'
import { FullRecipe } from '@/types/recipe';

//// Props

const props = defineProps<{
  recipe: FullRecipe,
  showTitle: boolean,
}>();

//// Pinia

const shoppingListStore = useShoppingListStore()
const shoppingList = computed(() => shoppingListStore.shoppingList)

function ingredientIsInShoppingList(ingredient: string) { 
  return shoppingList.value.some(item => item.item === ingredient)
}
</script>

<template>
  <div class="recipe-single">
    <h3 
      v-if="showTitle"
      class="recipe-single__name">
      {{ recipe.name }}
    </h3>
    <div class="recipe-single__section">
      <h4 style="display: none;">Ingredients</h4>
      <ul
        v-if="recipe.sections?.length === 0"
        class="recipe-single__ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="`ingredient-${ingredient}`">
          <div class="recipe-single__ingredient-wrapper">
            {{ ingredient.quantity ?? "" }}
            {{ ingredient.measure ?? "" }}
            {{ ingredient.name }}
            <span class="shopping-list-marker" v-if="ingredientIsInShoppingList(ingredient.name)">
              <IconoirProvider>
                <Check width="14" />
                <Cart width="14" />
              </IconoirProvider>
            </span>
            <button v-else class="add-to-list-button" @click="shoppingListStore.add(ingredient.name)">
              <IconoirProvider>
                <Cart width="14" />
              </IconoirProvider>
            </button>
          </div>
        </li>
      </ul>
      <template v-else>
        <template v-for="section in recipe.sections">
          <h5 class="recipe-single__heading">{{ section.name }}</h5>
          <ul class="recipe-single__ingredients">
            <li v-for="ingredient in section.ingredients" :key="`ingredient-${ingredient}`">
              <div class="recipe-single__ingredient-wrapper">
                {{ ingredient.quantity ?? "" }}
                {{ ingredient.measure ?? "" }}
                {{ ingredient.name }}
                <template v-if="ingredient.note">
                  ({{ ingredient.note }})
                </template>
                <span class="shopping-list-marker" v-if="ingredientIsInShoppingList(ingredient.name)">
                  <IconoirProvider>
                    <Check width="14" />
                    <Cart width="14" />
                  </IconoirProvider>
                </span>
                <button v-else class="add-to-list-button" @click="shoppingListStore.add(ingredient.name)">
                  <IconoirProvider>
                    <Cart width="14" />
                  </IconoirProvider>
                </button>
              </div>
            </li>
          </ul>
        </template>
      </template>
    </div>
    <div class="recipe-single__section">
      <h4 style="display: none;">Instructions</h4>
      <div v-if="recipe.sections?.length === 0" class="recipe-single__instructions">
        <p v-for="instruction in recipe.instructions">
          {{ instruction }}
        </p>
      </div>
      <template v-else>
        <template v-for="section in recipe.sections">
          <h5 style="display: none;" class="recipe-single__heading">{{ section.name }}</h5>
          <div class="recipe-single__instructions">
            <p v-for="instruction in section.instructions">
              {{ instruction }}
            </p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>


<style lang="sass">
@use '@/assets/variables' as v

.recipe-single
  display: flex
  flex-direction: column
  font-size: 16px
  &__name
    font-size: 1.75em
    font-weight: 600
    margin-bottom: 0.5em
  &__heading
    font-size: 1em
    font-weight: 600
    text-transform: uppercase
    line-height: 1.15
    margin-bottom: 0.25em
  &__section
    display: flex
    flex-direction: column
  &__ingredients
    font-size: clamp(16px, 0.85em, 20px)
    margin-bottom: 2em
  &__instructions
    margin-bottom: 1.33em
    p
      margin-top: 0
      margin-bottom: 1.33em
      line-height: 1.66  
      &:last-child
        margin-bottom: 0
  &__ingredient-wrapper
    display: flex
    gap: 4px
    align-items: center
    margin: 4px 0
  &__calendar
    display: flex
    gap: 8px
    align-items: flex-end
    flex-wrap: wrap
    button
      width: 100%
      height: 32px
      border: 1px solid v.$accent
      color: v.$accent
      background: v.$cream
      cursor: pointer
      &:hover
        background: v.$cream-200
  &__input
    span
      display: block
      margin-bottom: 4px
  &__close
    position: absolute
    bottom: 64px
    left: 50%
    transform: translateX(-50%)
  &__edit
    position: absolute
    top: 24px
    right: 24px
  input
    border: 1px solid v.$background
  h4
    font-size: 18px

.shopping-list-marker
  margin-left: auto
  display: inline-flex
  align-items: center
  gap: 4px

.add-to-list-button
  min-width: unset
  width: 28px
  height: 28px
  padding: 4px
  display: inline-flex
  align-items: center
  justify-content: center
  box-sizing: border-box
</style>
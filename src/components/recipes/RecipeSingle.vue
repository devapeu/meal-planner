<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useShoppingListStore } from '@/stores/useShoppingList'
import { useCalendarStore } from '@/stores/useCalendar'
import RecipesForm from './RecipesForm.vue'
import { Cart, Check } from '@iconoir/vue'

const recipesStore = useRecipesStore()
const shoppingListStore = useShoppingListStore()
const calendarStore = useCalendarStore()

const props = defineProps({
  id: Number,
  showTitle: Boolean,
})

const recipe = computed(() => recipesStore.currentRecipe)
const shoppingList = computed(() => shoppingListStore.shoppingList)
const startDate = ref('')
const endDate = ref('')
const isEditing = ref(false)

function ingredientIsInShoppingList(ingredient) {
  return shoppingList.value.some(item => item.item === ingredient)
}

onMounted(() => {
  recipesStore.getSingle(props.id)
})

watch(() => props.id, () => {
  recipesStore.getSingle(props.id)
})
</script>

<template>
  <div class="recipe-single">
    <button 
      class="recipe-single__edit"
      @click="isEditing = !isEditing">{{ isEditing ? 'Cancel' : 'Edit' }}</button>
    <template v-if="!isEditing">
      <div class="recipe-single__section">
        <h3 
          v-if="showTitle"
          class="recipe-single__name">
          {{ recipe.name }}
        </h3>
        <h4>Ingredients</h4>
        <ul>
          <li v-for="ingredient in recipe.ingredients" :key="ingredient">
            <div class="recipe-single__ingredient-wrapper">
              {{ ingredient }}
              <span 
                class="shopping-list-marker"
                v-if="ingredientIsInShoppingList(ingredient)">
                <Check width="14" /><Cart width="14" />
              </span>
              <button 
                v-else
                class="add-to-list-button"
                @click="shoppingListStore.add(ingredient)">
                <Cart width="14" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="recipe-single__section">
        <h4>Instructions</h4>
        <div class="recipe-single__instructions">{{ recipe.instructions }}</div>
      </div>
      <div class="recipe-single__section">
        <h4>Add to calendar</h4>
        <div class="recipe-single__calendar">
          <label 
            class="recipe-single__input"
            for="startDate">
            <span>From</span>
            <input type="date" id="startDate" v-model="startDate" />
          </label>
          <label 
            class="recipe-single__input"
            for="endDate">
            <span>To</span>
            <input type="date" id="endDate" v-model="endDate" />
          </label>
          <button @click="calendarStore.add(recipe.name, startDate, endDate)">Save</button>
        </div>
      </div>
    </template>
    <template v-else>
      <RecipesForm 
        :id="props.id"
        :name="recipe.name"
        :ingredients="recipe.ingredients"
        :instructions="recipe.instructions" 
        @close="isEditing = false" />
    </template>
  </div>
</template>

<style lang="sass">
@use '@/assets/variables' as v

.recipe-single
  display: flex
  flex-direction: column
  gap: 16px
  &__name
    font-size: 28px
  &__section
    display: flex
    flex-direction: column
    gap: 8px
  &__instructions
    max-width: 480px
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
<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import { useShoppingListStore } from '@/stores/useShoppingList'
import { useCalendarStore } from '@/stores/useCalendar'
import RecipesForm from './RecipesForm.vue'

const recipesStore = useRecipesStore()
const slideoutStore = useSlideoutStore()
const shoppingListStore = useShoppingListStore()
const calendarStore = useCalendarStore()

const props = defineProps({
  id: Number
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
      <h3 class="recipe-single__name">{{ recipe.name }}</h3>
      <div class="recipe-single__section">
        <h4>Ingredients</h4>
        <ul>
          <li v-for="ingredient in recipe.ingredients" :key="ingredient">
            {{ ingredient }}
            <span v-if="ingredientIsInShoppingList(ingredient)">🛒</span>
            <button 
              v-else
              @click="shoppingListStore.add(ingredient)">🛒
            </button>
          </li>
        </ul>
      </div>
      <div class="recipe-single__section">
        <h4>Instructions</h4>
        <div>{{ recipe.instructions }}</div>
      </div>
      <div class="recipe-single__section">
        <h4>Add to calendar</h4>
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
      <button 
        class="recipe-single__close"
        @click="slideoutStore.close">Close</button>
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
.recipe-single
  display: flex
  flex-direction: column
  gap: 16px
  &__name
    font-size: 28px
    font-weight: 500
  &__section
    display: flex
    flex-direction: column
    gap: 8px
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
</style>

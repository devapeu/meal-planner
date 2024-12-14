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
    <template v-if="!isEditing">
      <h3>{{ recipe.name }}</h3>
      <button @click="isEditing = true">Edit</button>
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
      <h4>Instructions</h4>
      <p>{{ recipe.instructions }}</p>
      <h4>Add to calendar</h4>
      <label for="startDate">
        <span>From</span>
        <input type="date" id="startDate" v-model="startDate" />
      </label>
      <label for="endDate">
        <span>To</span>
        <input type="date" id="endDate" v-model="endDate" />
      </label>
      <button 
        @click="calendarStore.add(recipe.name, startDate, endDate)">Save</button>
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
  &__close
    position: absolute
    bottom: 64px
    left: 50%
    transform: translateX(-50%)
</style>
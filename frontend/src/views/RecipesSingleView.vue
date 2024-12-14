<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useShoppingListStore } from '@/stores/useShoppingList'
import { useRecipesStore } from '@/stores/useRecipes'

const route = useRoute()
const shoppingListStore = useShoppingListStore();
const shoppingList = computed(() => shoppingListStore.shoppingList);

const recipesStore = useRecipesStore();
const recipe = computed(() => recipesStore.currentRecipe);

const ingredients = ref([])

watch(recipe, () => {
  ingredients.value = recipe.value.ingredients.split(',') || []
})

function addToShoppingList(ingredient) {
  shoppingListStore.add(ingredient)
}

function ingredientIsInShoppingList(ingredient) {
  return shoppingList.value.some(item => item.item === ingredient)
}

onMounted(() => {
  shoppingListStore.get();
  recipesStore.getSingle(route.params.id);
})
</script>

<template>
  <main>
    <h2>Ingredients</h2>
    <ul>
      <li v-for="ingredient in ingredients" :key="ingredient">
        <span v-if="ingredientIsInShoppingList(ingredient)">🛒</span>
        {{ ingredient }}
        <button 
          v-if="!ingredientIsInShoppingList(ingredient)" 
          @click="addToShoppingList(ingredient)">Add to shopping list
        </button>
      </li>
    </ul>
    <h2>Instructions</h2>
    <p>{{ recipe.instructions }}</p>
  </main>
</template>

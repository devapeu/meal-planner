<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'

import { NDrawerContent } from 'naive-ui'
import RecipesFormSlideout from './RecipesFormSlideout.vue'
import RecipesSingle from '@/components/recipes/RecipesSingle.vue'

//// Props

const props = defineProps<{
  id: number,
  showTitle: boolean
}>();

//// Pinia

const recipesStore = useRecipesStore()
const slideoutStore = useSlideoutStore()
const recipe = computed(() => recipesStore.currentRecipe)

watch(
  () => props.id, (id) => {
    recipesStore.getSingle(id)
  },
  { immediate: true }
)

//// Calendar Properties

const startDate = ref('')
const endDate = ref('')

//// Slideout

function openRecipeFormSlideout() {
  slideoutStore.open(RecipesFormSlideout, {
    id: props.id,
    name: recipe.value.name,
    content: recipe.value.content,
  });
}
</script>

<template>
  <n-drawer-content>
    <template #header>
      <div class="slideout__header">{{ recipe?.name || 'Loading...' }}</div>
    </template>
    <RecipesSingle v-if="recipe" :recipe="recipe" :show-title="false"/>
    <div v-else class="loading-state">Loading recipe...</div>
    <template #footer>
      <button @click="slideoutStore.close">Close</button>
      <button
        :disabled="!recipe"
        @click="openRecipeFormSlideout">
        Edit Recipe
      </button>
    </template>
  </n-drawer-content>
</template>

<style lang="sass" scoped>
.loading-state
  padding: 20px
  text-align: center
  color: #666
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'

const emit = defineEmits(['close'])
const slideoutStore = useSlideoutStore()

const props = defineProps({
  id: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  ingredients: {
    type: Array,
    required: false
  },
  instructions: {
    type: String,
    required: false
  }
})

const recipesStore = useRecipesStore();

const id = ref(null)
const name = ref('')
const newIngredient = ref('')
const ingredients = ref([])
const instructions = ref('')

const newIngredientInput = ref(null)

function submitRecipe() {
  const contents = {
    name: name.value,
    ingredients: ingredients.value,
    instructions: instructions.value,
  }

  if (props.id) {
    recipesStore.update(props.id, contents)
  } else {  
    recipesStore.add(contents)
    slideoutStore.close()
  }

  emit('close')
}

function addIngredient() {
  ingredients.value.push(newIngredient.value);
  newIngredient.value = '';
  newIngredientInput.value.focus();
}

function removeIngredient(ingredient) {
  ingredients.value = ingredients.value.filter(i => i !== ingredient);
}

onMounted(() => {
  id.value = props.id || null
  name.value = props.name || ''
  ingredients.value = props.ingredients || []
  instructions.value = props.instructions || ''
})
</script>

<template>
  <form class="recipes-form">
    <label for="name">
      Name
      <input 
        class="recipes-form__input-name"
        type="text" 
        v-model="name" 
        placeholder="Name" />
    </label>
    <label for="ingredients">
      Ingredients
      <ul>
        <li v-for="ingredient in ingredients" :key="ingredient">
          {{ ingredient }}
          <button type="button" @click="removeIngredient(ingredient)">&times;</button>
        </li>
        <li>
          <input 
          ref="newIngredientInput" 
          type="text" 
          v-model="newIngredient" 
          placeholder="Add new ingredient"
          @keyup.enter="addIngredient" />
          <button type="button" @click="addIngredient">+</button>
        </li>
      </ul>
    </label>
    <label for="instructions">
      Instructions
      <textarea 
        class="recipes-form__textarea"
        type="text" 
        v-model="instructions" 
        placeholder="Instructions" /> 
    </label>
    <button type="button" @click="submitRecipe">{{ props.id ? 'Update' : 'Create' }}</button>
  </form>
</template>

<style lang="sass">
@use '@/assets/variables' as v
.recipes-form
  display: flex
  flex-direction: column
  gap: 16px
  label
    display: flex
    flex-direction: column
    gap: 4px
  input, textarea
    border: 1px solid v.$background
  ul
    margin: 0
  &__input-name
    font-size: 20px
  &__textarea
    font-size: 16px
    height: 150px
    width: 100%
</style>
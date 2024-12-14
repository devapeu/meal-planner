<script setup>
import { ref, onMounted, watch } from 'vue'
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
const recipe = ref(null);

const id = ref(null)
const name = ref('')
const newIngredient = ref('')
const ingredients = ref([])
const instructions = ref('')

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
}

function removeIngredient(ingredient) {
  ingredients.value = ingredients.value.filter(i => i !== ingredient);
}

onMounted(() => {
  if (props.id) {
    recipesStore.getSingle(props.id);
  }
  id.value = props.id || null
  name.value = props.name || ''
  ingredients.value = props.ingredients || []
  instructions.value = props.instructions || ''
})
</script>

<template>
  <main>
    <form>
      <input type="text" v-model="name" placeholder="Name" />
      <ul>
        <li v-for="ingredient in ingredients" :key="ingredient">
          {{ ingredient }}
          <button @click="removeIngredient(ingredient)">Remove</button>
        </li>
        <li>
          <form @submit.prevent="addIngredient">
            <input type="text" v-model="newIngredient" placeholder="Ingredients" />
            <button type="submit">Add Ingredient</button>
          </form>
        </li>
      </ul>
      <textarea type="text" v-model="instructions" placeholder="Instructions" /> 
      <button type="submit" @click.prevent="submitRecipe">Create</button>
    </form>
  </main>
</template>

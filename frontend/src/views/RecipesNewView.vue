<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const ingredient = ref('');
const ingredients = ref([]);
const instructions = ref('');

function postRecipe() {
  fetch('http://localhost:8000/recipes', {
    method: 'POST',
    body: JSON.stringify({ 
      name: name.value,
      ingredients: ingredients.value.join(','),
      instructions: instructions.value,
    })
  })
  router.push('/recipes')
}

function addIngredient() {
  ingredients.value.push(ingredient.value);
  ingredient.value = '';
}

function removeIngredient(ingredient) {
  ingredients.value = ingredients.value.filter(i => i !== ingredient);
}
</script>

<template>
  <main>
    <h1>New Recipe</h1>
    <form>
      <input type="text" v-model="name" placeholder="Name" />
      <ul>
        <li v-for="ingredient in ingredients" :key="ingredient">
          {{ ingredient }}
          <button @click="removeIngredient(ingredient)">Remove</button>
        </li>
        <li>
          <form @submit.prevent="addIngredient">
            <input type="text" v-model="ingredient" placeholder="Ingredients" />
            <button type="submit">Add Ingredient</button>
          </form>
        </li>
      </ul>
      <textarea type="text" v-model="instructions" placeholder="Instructions" /> 
      <button type="submit" @click="postRecipe">Create</button>
    </form>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import { NDrawerContent } from 'naive-ui'
import RecipeSingle from '@/components/recipes/RecipeSingle.vue'

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
  content: {
    type: String,
    required: false,
  }
})

const recipesStore = useRecipesStore();

const id = ref(null)
const name = ref('')
const content = ref('');

function submitRecipe() {
  let data = {};

  data.name = name.value;
  data.content = content.value;

  if (props.id) {
    recipesStore.update(props.id, data)
  } else {  
    recipesStore.add(data)
    openRecipeSlideout()
  }
}

function openRecipeSlideout() {
  slideoutStore.open(RecipeSingle, {
    id: props.id,
    name: props.name,
    content: props.content,
  });
}

onMounted(() => {
  id.value = props.id || null;
  name.value = props.name || '';
  content.value = props.content;
})
</script>

<template>
  <n-drawer-content>
    <template #header>
      <div class="slideout__header">Edit Recipe</div>
    </template>
    <form class="recipes-form">
      <label for="name">
        <span>Name</span>
        <input 
          class="recipes-form__input-name"
          type="text" 
          v-model="name" 
          placeholder="Name" />
      </label>
      <label for="content">
        <span>Content</span>
        <textarea name="content" v-model="content" placeholder="Write your recipe..." />
      </label>
    </form>
    <template #footer>
      <button @click="openRecipeSlideout">Cancel</button>
      <button type="button" @click="submitRecipe">{{ props.id ? 'Update' : 'Create' }}</button>
    </template>
  </n-drawer-content>
</template>

<style lang="sass">
@use '@/assets/variables' as v
.recipes-form
  margin: 4px
  display: flex
  flex-direction: column
  gap: 16px
  label
    display: flex
    flex-direction: column
    gap: 4px
    span
      font-weight: 600
  input, textarea
    border: 1px solid v.$background
    background: white
  ul
    margin: 0
  &__input-name
    font-size: 20px
  &__textarea
    font-size: 16px
    height: 150px
    width: 100%
</style>
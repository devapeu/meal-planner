<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecipesStore } from '@/stores/useRecipes'
import { useSlideoutStore } from '@/stores/useSlideout'
import { NDrawerContent } from 'naive-ui'
import RecipesSingle from '@/components/recipes/RecipesSingle.vue'
import { Recipe } from '@/types/recipe'

const slideoutStore = useSlideoutStore()

const props = defineProps<{
  id?: number,
  name?: string,
  content?: string,
}>();

const recipesStore = useRecipesStore();

const id = ref(null)
const name = ref('')
const content = ref('');

function submitRecipe() {
  let data: Recipe = {
    id: null,
    name: name.value,
    content: content.value
  };

  if (props.id) {
    recipesStore.update(props.id, data)
    openRecipeSlideout({
      id: props.id,
      name: data.name,
      content: data.content
    });
  } else {  
    recipesStore.add(data)
    slideoutStore.close();
  }
}

function cancelSlideout(){
  if (id.value) {
    openRecipeSlideout({
      id: props.id,
      name: props.name,
      content: props.content,
    })
  } else {
    slideoutStore.close();
  }
}

function openRecipeSlideout(payload) {
  slideoutStore.open(RecipesSingle, payload);
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
      <div class="slideout__header">{{ id ? 'Edit Recipe' : 'Add Recipe' }}</div>
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
      <label for="content" class="recipes-form__content">
        <span>Content</span>
        <textarea name="content" v-model="content" placeholder="Write your recipe..." />
      </label>
    </form>
    <template #footer>
      <div class="slideout__buttons">
        <button @click="cancelSlideout">Cancel</button>
        <button class="btn-accent" @click="submitRecipe">{{ props.id ? 'Update' : 'Create' }}</button>
      </div>
    </template>
  </n-drawer-content>
</template>

<style lang="sass">
@use '@/assets/variables' as v
.recipes-form
  display: flex
  flex-direction: column
  gap: 16px
  height: 100%
  label
    display: flex
    flex-direction: column
    gap: 4px
    span
      font-weight: 600
  &__content
    flex: 1
    textarea
      height: 100%
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
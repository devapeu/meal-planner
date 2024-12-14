<script setup>
import { ref } from 'vue';
import { useShoppingListStore } from '@/stores/useShoppingList';

const props = defineProps({
  id: Number,
  item: String
})

const isChecked = ref(false);
const shoppingListStore = useShoppingListStore();

function toggleCheckbox() {
  isChecked.value = !isChecked.value;
}

</script>

<template>
  <div 
    class="shopping-list-item"
    :class="{ 'shopping-list-item--checked': isChecked }">
    <span 
      class="shopping-list-item__checkbox" 
      @click="toggleCheckbox"></span>
    <span class="shopping-list-item__item" @click="toggleCheckbox">{{ item }}</span>
    <button @click="shoppingListStore.remove(id)">&times;</button>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables.sass' as v

.shopping-list-item
  display: flex
  align-items: center
  gap: 8px
  font-family: 'Gochi Hand'
  font-size: 20px
  &--checked
    .shopping-list-item__item
      opacity: 0.5
      text-decoration: line-through
    .shopping-list-item__checkbox
      opacity: 0.5
      background: v.$background
      &::after
        content: '✓'
        color: v.$accent
  &__item
    cursor: pointer
    @media (pointer: fine)
      &:hover
        color: v.$accent
  &__checkbox
    border-radius: 50%
    width: 24px
    height: 24px
    border: 1px solid v.$accent
    cursor: pointer
  &__item
    flex: 1
</style>
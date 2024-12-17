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
    <button 
      class="shopping-list-item__remove-button"
      @click="shoppingListStore.remove(id)">&times;</button>
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
  @media (pointer: fine)
    &:hover
      color: v.$accent
      .shopping-list-item__checkbox
        border-color: v.$accent
  &--checked
    .shopping-list-item__item
      opacity: 0.5
      text-decoration: line-through
    .shopping-list-item__checkbox
      border-color: v.$wine
      opacity: 0.5
      &::after
        content: '✔'
        font-size: 14px
        height: 24px
        width: 24px
        display: flex
        align-items: center
        justify-content: center
  &__item
    cursor: pointer
    color: inherit
  &__checkbox
    border-radius: 50%
    width: 24px
    height: 24px
    border: 1px solid v.$accent
    cursor: pointer
    color: inherit
    &::after
      color: inherit
  &__item
    flex: 1
  &__remove-button
    cursor: pointer
    color: v.$accent
    background: none
    height: 24px
    width: 24px
    border: none
    font-size: 20px
    display: flex
    align-items: center
    justify-content: center
    @media (pointer: fine)
      &:hover
        background: v.$cream
</style>

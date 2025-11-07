<script setup>
import { ref } from 'vue';
import { useShoppingListStore } from '@/stores/useShoppingList';
import { EditPencil, Xmark, Check, Undo } from '@iconoir/vue';

const props = defineProps({
  id: Number,
  item: String
})

const isChecked = ref(false);

const itemValue = ref(props.item);
const isEditing = ref(false);

const shoppingListStore = useShoppingListStore();

function toggleCheckbox() {
  isChecked.value = !isChecked.value;
}

function updateItem(id, item) {
  console.log(id, item);
  shoppingListStore.update(id, item);
  isEditing.value = false;
}

function handleLeftButton() {
  if (isEditing.value === true) {
    updateItem(props.id, itemValue.value)
  } else {
    console.log("should enable edit")
    isEditing.value = true;
  }
}

function handleRightButton() {
  if (isEditing.value === true) {
    isEditing.value = false;
    itemValue.value = props.item;
  } else {
    console.log("should deelte")
    shoppingListStore.remove(props.id);
  }
}

</script>

<template>
  <div 
    class="shopping-list-item"
    :class="{ 'shopping-list-item--checked': isChecked }">
    <form
      v-if="isEditing"
      @submit.prevent="updateItem(id, itemValue)">
      <input v-model="itemValue" type="text"/>
    </form>
    <div v-else class="row">
      <span 
        class="shopping-list-item__checkbox" 
        @click="toggleCheckbox"></span>
      <span class="shopping-list-item__item" @click="toggleCheckbox">{{ item }}</span>
    </div>
    <div class="row">
      <button 
        class="action-item-button action-item-button--edit" 
        @click="handleLeftButton">
        <Check v-if="isEditing" width="18"/>
        <EditPencil v-else width="18"/>
      </button>
      <button 
        class="action-item-button action-item-button--delete" 
        @click="handleRightButton">
        <Undo v-if="isEditing" width="18"/>
        <Xmark v-else width="18"/>
      </button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables.sass' as v

.shopping-list-item
  display: flex
  align-items: center
  justify-content: space-between
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
    line-height: 1
  .row
    display: flex
    align-items: center
    gap: 8px
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

.action-item-button
  cursor: pointer
  color: v.$accent
  background: none
  padding: 0
  border: none
  display: inline-flex
  align-items: center
  justify-content: center
  transition: all 100ms ease-in-out
  border: 1px solid transparent
  @media (pointer: fine)
    &:hover
      background: v.$cream
      border: 1px solid v.$accent
  &--delete
    @media (pointer:fine)
      &:hover
        background: v.$background-300
        color: v.$cream
</style>

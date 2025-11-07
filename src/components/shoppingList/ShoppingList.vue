<script setup>
import { ref, nextTick, onMounted, computed } from "vue";
import { useShoppingListStore } from '@/stores/useShoppingList';
import ShoppingListItem from './ShoppingListItem.vue';

const shoppingListStore = useShoppingListStore();
const shoppingList = computed(() => shoppingListStore.shoppingList);

const input = ref(null);
const addButton = ref(null);

const newItem = ref('');
const isAddingAction = ref(false);

function showInput() {
  isAddingAction.value = true;
  nextTick(() => {
    input.value.focus();
  })
}

function addItem() {
  shoppingListStore.add(newItem.value);
  newItem.value = '';
  isAddingAction.value = false;
  nextTick(() => {
    addButton.value.focus();
  })
}

function clearList() {
  if (confirm('Are you sure you want to clear the list?')) {
    shoppingListStore.clear();
  }
}

onMounted(() => {
  shoppingListStore.get();
})
</script>
<template>
  <div class="shopping-list-wrapper">
    <div class="shopping-list-header">
      <h2>Shopping List</h2>
      <button @click="clearList">Clear list</button>
    </div>
    <ul class="shopping-list">
      <template v-if="shoppingList.length > 0">
        <li 
          v-for="{id, item} in shoppingList"
          :key="id">
          <ShoppingListItem 
          :id="id"
            :item="item" />
        </li>
      </template>
      <template v-else>
        <li>No items on your list.</li>
      </template>
      <li>
        <button 
          v-if="!isAddingAction"
          ref="addButton"
          class="add-button"
          @click="showInput">
          <span class="add-button__icon">+</span>
          Add new
        </button>
        <form 
          v-else
          class="add-shopping-list-item">
          <input 
            v-model="newItem"
            ref="input"
            type="text"/>
          <button 
            type="submit" 
            @click="addItem">
            Save
          </button>
          <button @click="isAddingAction = false">
            &times;
          </button>
        </form>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as v

.add-shopping-list-item
  display: flex
  input
    max-width: 192px
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    border-right: none
  button
    border-top-left-radius: 0
    border-bottom-left-radius: 0
  button:not([type="submit"])
    text-align: center
    border: none
    background: none
    width: 32px
    height: 32px
    padding: 0
    color: v.$accent
    border-radius: 4px
    cursor: pointer
    order: -1
    @media (pointer: fine)
      &:hover
        background: v.$cream

.shopping-list-wrapper
  background: #fff
  border: 1px solid v.$background-200
  display: flex
  flex-direction: column
  gap: 16px
  padding: 20px
  border-radius: 8px
  h2
    margin: 0

.shopping-list-header
  display: flex
  justify-content: space-between
  align-items: center
  button
    color: v.$accent
    background: none
    border: none
    padding: 4px 12px
    border-radius: 4px
    @media (pointer: fine)
      &:hover
        background: v.$cream
  
.shopping-list
  display: flex
  flex-direction: column
  gap: 12px
  list-style: none
  margin: 0
  padding: 0

.add-button
  display: flex
  align-items: center
  gap: 8px
  border: none
  background: none
  padding: 0
  cursor: pointer
  height: 32px
  &:focus-visible, &:focus
    color: v.$accent
  @media (pointer: fine)
    &:hover
      color: v.$accent
  &__icon
    background: v.$accent
    color: #fff
    line-height: 1
    font-size: 16px
    height: 20px
    width: 20px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 50%
</style>

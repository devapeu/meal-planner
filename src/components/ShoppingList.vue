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

onMounted(() => {
  shoppingListStore.get();
})
</script>
<template>
  <div class="shopping-list-wrapper">
    <h2>Shopping List</h2>
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
        <form v-else>
          <input 
            v-model="newItem"
            ref="input"
            type="text"/>
          <button 
            type="submit" 
            @click="addItem">
            Save
          </button>
        </form>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
@import '@/assets/variables.sass'

.shopping-list-wrapper
  background: #fff
  display: flex
  flex-direction: column
  gap: 16px
  padding: 20px
  border-radius: 8px
  h2
    margin: 0
  
.shopping-list
  display: flex
  flex-direction: column
  gap: 16px
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
  font-size: 16px
  height: 32px
  @media (pointer: fine)
    &:hover
      color: $accent
  &__icon
    background: $accent
    color: #fff
    line-height: 1
    font-size: 24px
    height: 24px
    width: 24px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 50%
</style>

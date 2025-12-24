<script setup>
import { ref, nextTick, onMounted, computed, watch } from "vue";
import { useShoppingListStore } from '@/stores/useShoppingList';
import ShoppingListItem from './ShoppingListItem.vue';
import Draggable from 'vuedraggable';

const shoppingListStore = useShoppingListStore();
const shoppingList = computed(() => shoppingListStore.shoppingList);
const draggableList = ref([]);

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

function handleDragEnd() {
  const newOrder = draggableList.value.map(item => ({
    id: item.id,
    item: item.item
  }));
  shoppingListStore.reorder(newOrder);
}

onMounted(() => {
  shoppingListStore.get();
})

watch(shoppingList, (newList) => {
  draggableList.value = Array.isArray(newList) ? newList.map(i => ({ ...i })) : [];
}, { immediate: true })
</script>
<template>
  <section class="shopping-list-wrapper">
    <header class="shopping-list-header">
      <h2>Shopping List</h2>
      <button @click="clearList">Clear list</button>
    </header>
    <div class="shopping-list">
      <template v-if="draggableList.length > 0">
        <draggable
          v-model="draggableList"
          class="draggable-container"
          :animation="200"
          item-key="id"
          handle=".drag-handle"
          tag="ul"
          @end="handleDragEnd">
          <template #item="{ element }">
            <li class="draggable-item">
              <ShoppingListItem
                :id="element.id"
                :item="element.item"
              />
            </li>
          </template>
        </draggable>
      </template>
      <template v-else>
        No items on your list.
      </template>
      <div>
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
            @click.prevent="addItem">
            Save
          </button>
          <button type="button" @click="isAddingAction = false">
            &times;
          </button>
        </form>
      </div>
    </div>
  </section>
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

  .draggable-container
    display: flex
    flex-direction: column
    gap: 12px
    list-style: none
    padding: 0

  .draggable-item
    display: flex
    align-items: center
    transition: background-color 0.2s ease
    border-radius: 8px

    .shopping-list-item
      flex: 1
    
    &.active
      :deep(.drag-handle)
        cursor: grabbing
        background: v.$background 

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

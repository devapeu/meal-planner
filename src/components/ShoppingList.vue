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
      <li 
        v-for="{id, item} in shoppingList"
        :key="id">
        <ShoppingListItem 
          :id="id"
          :item="item" />
      </li>
      <li>
        <button 
          v-if="!isAddingAction"
          ref="addButton"
          @click="showInput">
          Add new
        </button>
        <form v-else>
          <input 
            v-model="newItem"
            ref="input"
            type="text"/><button type="submit" @click="addItem">Save</button>
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
  h2
    margin: 0
  
.shopping-list
  display: flex
  flex-direction: column
  gap: 16px
  list-style: none
  margin: 0
  padding: 0
</style>
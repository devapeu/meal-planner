<script setup>
import { ref, nextTick } from "vue";

const input = ref(null);

const shoppingList = ref([]);
const newItem = ref('');
const isAddingAction = ref(false);

shoppingList.value.push({ id: 1, value: '250g chicken' });
shoppingList.value.push({ id: 2, value: 'Oranges' });

function deleteItem(id){
  const index = shoppingList.value.findIndex(item => item.id === id);
  if (index != -1) {
    shoppingList.value.splice(index, 1)
  }
}

function showInput() {
  isAddingAction.value = true;
  nextTick(() => {
    input.value.focus();
  })
}

function addItem() {
  shoppingList.value = [...shoppingList.value, { id: Math.random(), value: newItem.value }];
  newItem.value = '';
  isAddingAction.value = false;
}
</script>
<template>
  <ul>
    <li 
      v-for="item in shoppingList"
      :key="item.id">
      {{ item.value }} <button @click="deleteItem(item.id)">Delete</button>
    </li>
    <li>
      <button 
        v-if="!isAddingAction"
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
</template>
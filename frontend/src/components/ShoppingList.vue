<script setup>
import { ref, nextTick, onMounted } from "vue";

const input = ref(null);
const addButton = ref(null);

const shoppingList = ref([]);
const newItem = ref('');
const isAddingAction = ref(false);

function showInput() {
  isAddingAction.value = true;
  nextTick(() => {
    input.value.focus();
  })
}

function addItem() {
  postShoppingList(newItem.value);
  newItem.value = '';
  isAddingAction.value = false;
  nextTick(() => {
    addButton.value.focus();
  })
}

function getShoppingList() {
  fetch('http://localhost:8000/shopping-list')
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
}

function deleteShoppingList(id) {
  fetch(`http://localhost:8000/shopping-list/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => shoppingList.value = data.shopping_list)
  .catch(error => console.error('Error:', error));
}

function postShoppingList(item) {
  fetch('http://localhost:8000/shopping-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ item: item })
  })
  .then(response => response.json())
  .then(data => shoppingList.value = data.shopping_list)
  .catch(error => console.error('Error:', error));
}

onMounted(() => {
  getShoppingList();
})
</script>
<template>
  <ul>
    <li 
      v-for="{id, item} in shoppingList"
      :key="id">
      {{ item }} 
      <button @click="deleteShoppingList(id)">Delete</button>
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
</template>
import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useShoppingListStore = defineStore('shoppingList', () => {
  const shoppingList = ref([])

  function get() {
    fetch(`${VITE_API_URL}/shopping-list`)
      .then(response => response.json())
      .then(data => shoppingList.value = data.shopping_list)
      .catch(error => console.error('Error:', error));
  }

  function add(ingredient) {  
    fetch(`${VITE_API_URL}/shopping-list`, {
      method: 'POST',
      body: JSON.stringify({ item: ingredient })
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function remove(ingredient) {
    fetch(`${VITE_API_URL}/shopping-list/${ingredient}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function update(id, ingredient) {
    fetch(`${VITE_API_URL}/shopping-list`, {
      method: 'POST',
      body: JSON.stringify({ id, item: ingredient })
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error: ', error));
  }

  function clear() {
    fetch(`${VITE_API_URL}/shopping-list`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  return { shoppingList, get, add, remove, update, clear }
})

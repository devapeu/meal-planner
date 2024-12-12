import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShoppingListStore = defineStore('shoppingList', () => {
  const shoppingList = ref([])

  function get() {
    fetch('http://localhost:8000/shopping-list')
      .then(response => response.json())
      .then(data => shoppingList.value = data.shopping_list)
      .catch(error => console.error('Error:', error));
  }

  function add(ingredient) {  
    fetch('http://localhost:8000/shopping-list', {
      method: 'POST',
      body: JSON.stringify({ item: ingredient })
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function remove(ingredient) {
    fetch(`http://localhost:8000/shopping-list/${ingredient}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  return { shoppingList, get, add, remove, }
})

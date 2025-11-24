import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuth'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useShoppingListStore = defineStore('shoppingList', () => {
  const shoppingList = ref([])

  function get() {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/`, {
      headers: authStore.getAuthHeaders()
    })
      .then(response => response.json())
      .then(data => shoppingList.value = data.shopping_list)
      .catch(error => console.error('Error:', error));
  }

  function add(ingredient) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/`, {
      method: 'POST',
      body: JSON.stringify({ item: ingredient }),
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeaders()
      }
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function remove(ingredient) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/${ingredient}/`, {
      method: 'DELETE',
      headers: authStore.getAuthHeaders()
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function update(id, ingredient) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/`, {
      method: 'PUT',
      body: JSON.stringify({ id, item: ingredient }),
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeaders()
      }
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error: ', error));
  }

  function clear() {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/`, {
      method: 'DELETE',
      headers: authStore.getAuthHeaders()
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  function reorder(newOrder) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/shopping-list/reorder/`, {
      method: 'PUT',
      body: JSON.stringify({ items: newOrder }),
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeaders()
      }
    })
    .then(response => response.json())
    .then(data => shoppingList.value = data.shopping_list)
    .catch(error => console.error('Error:', error));
  }

  return { shoppingList, get, add, remove, update, clear, reorder }
})

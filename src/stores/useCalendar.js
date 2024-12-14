import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useCalendarStore = defineStore('calendar', () => {
  const calendar = ref([]);

  function getMealsForWeek(startDate) {
    fetch(`${VITE_API_URL}/calendar?startDate=${startDate}`)
      .then(response => response.json())
      .then(data => calendar.value = data.calendar)
  }

  function add(meal, startDate, endDate) {
    fetch(`${VITE_API_URL}/calendar`, {
      method: 'POST',
      body: JSON.stringify({ meal, startDate, endDate })
    })
    .then(response => response.json())
    .then(data => calendar.value = data.calendar)
  }

  function remove(id) {
    fetch(`${VITE_API_URL}/calendar/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => calendar.value = data.calendar)
  }

  return { calendar, getMealsForWeek, add, remove }
})
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
  const calendar = ref([])

  function getMealsForWeek(startDate, endDate) {
    fetch(`http://localhost:8000/calendar?startDate=${startDate}&endDate=${endDate}`)
      .then(response => response.json())
      .then(data => calendar.value = data.calendar)
  }

  function addMeal(meal) {
    fetch('http://localhost:8000/calendar', {
      method: 'POST',
      body: JSON.stringify(meal)
    })
  }

  function removeMeal(id) {
    fetch(`http://localhost:8000/calendar/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => calendar.value = data.calendar)
  }

  return { calendar, getMealsForWeek, addMeal, removeMeal }
})
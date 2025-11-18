import { CalendarItem, CalendarResponse } from '@/types/calendar';
import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useCalendarStore = defineStore('calendar', () => {
  const calendar = ref<CalendarItem[]>([]);

  function getMealsForWeek(startDate: string) {
    fetch(`${VITE_API_URL}/calendar?startDate=${startDate}`)
      .then(async response => {
        const data: CalendarResponse = await response.json();
        calendar.value = data.calendar;
      })
  }

  function add(meal: string, startDate: string, endDate: string) {
    fetch(`${VITE_API_URL}/calendar`, {
      method: 'POST',
      body: JSON.stringify({ meal, startDate, endDate })
    })
    .then(async response => {
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
  }

  function remove(id: string, startDate: string) {
    fetch(`${VITE_API_URL}/calendar/${id}?startDate=${startDate}`, {
      method: 'DELETE'
    })
    .then(async response => {
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
  }

  return { calendar, getMealsForWeek, add, remove }
})
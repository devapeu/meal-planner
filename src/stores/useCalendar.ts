import { CalendarItem, CalendarResponse } from '@/types/calendar';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuth'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useCalendarStore = defineStore('calendar', () => {
  const calendar = ref<CalendarItem[]>([]);

  function getMealsForWeek(startDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar?startDate=${startDate}`, {
      headers: authStore.getAuthHeaders()
    })
      .then(async response => {
        const data: CalendarResponse = await response.json();
        calendar.value = data.calendar;
      })
  }

  function add(meal: string, startDate: string, endDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar`, {
      method: 'POST',
      body: JSON.stringify({ meal, startDate, endDate }),
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeaders()
      }
    })
    .then(async response => {
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
  }

  function remove(id: string, startDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar/${id}?startDate=${startDate}`, {
      method: 'DELETE',
      headers: authStore.getAuthHeaders()
    })
    .then(async response => {
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
  }

  return { calendar, getMealsForWeek, add, remove }
})
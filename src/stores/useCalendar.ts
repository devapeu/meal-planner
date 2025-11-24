import { CalendarItem, CalendarResponse } from '@/types/calendar';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuth'

const VITE_API_URL = import.meta.env.VITE_API_URL

export const useCalendarStore = defineStore('calendar', () => {
  const calendar = ref<CalendarItem[]>([]);

  function getMealsForWeek(startDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar/?startDate=${startDate}`, {
      headers: authStore.getAuthHeaders()
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Calendar fetch failed:', response.status, errorData)
          if (response.status === 401) {
            console.error('Authentication failed - token might be invalid')
          }
          return
        }
        const data: CalendarResponse = await response.json();
        calendar.value = data.calendar;
      })
      .catch(error => {
        console.error('Network error fetching calendar:', error)
      })
  }

  function add(meal: string, startDate: string, endDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar/`, {
      method: 'POST',
      body: JSON.stringify({ meal, startDate, endDate }),
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeaders()
      }
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Calendar add failed:', response.status, errorData)
        return
      }
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
    .catch(error => {
      console.error('Network error adding to calendar:', error)
    })
  }

  function remove(id: string, startDate: string) {
    const authStore = useAuthStore()
    fetch(`${VITE_API_URL}/calendar/${id}/?startDate=${startDate}`, {
      method: 'DELETE',
      headers: authStore.getAuthHeaders()
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Calendar remove failed:', response.status, errorData)
        return
      }
      const data: CalendarResponse = await response.json();
      calendar.value = data.calendar;
    })
    .catch(error => {
      console.error('Network error removing from calendar:', error)
    })
  }

  return { calendar, getMealsForWeek, add, remove }
})
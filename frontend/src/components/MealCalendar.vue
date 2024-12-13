<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCalendarStore } from '../stores/useCalendar'

const selectedDate = ref(new Date().toISOString().split('T')[0]);

const calendarStore = useCalendarStore();

const weekStart = computed(() => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
});

const daysOfWeek = computed(() => {
  const days = [];
  const start = new Date(weekStart.value);
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
});

function addMeal(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const meal = formData.get('meal');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  calendarStore.addMeal(meal, startDate, endDate);
}

onMounted(() => {
  calendarStore.getMealsForWeek(selectedDate.value);
});

</script>

<template>
  <div>
    <input 
      v-model="selectedDate" 
      type="date" 
      @change="calendarStore.getMealsForWeek(selectedDate)"
    />
    <table>
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day.getDate() }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="meal in calendarStore.calendar" :key="meal.id">
          <td v-for="(day, index) in daysOfWeek" :key="index">
            <template v-if="meal.start_date <= day.toISOString().split('T')[0] && meal.end_date >= day.toISOString().split('T')[0]">
              {{ meal.meal }}
            </template>
            <template v-else>---</template>
          </td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent="addMeal">
      <input type="text" name="meal" placeholder="Add meal...">
      <input type="date" name="startDate" placeholder="Date...">
      <input type="date" name="endDate" placeholder="Date...">
      <button type="submit">Add</button>
    </form>
  </div>
</template>


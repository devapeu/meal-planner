<script setup>
import { onMounted } from 'vue'
import { useCalendarStore } from '../stores/useCalendar'

const calendarStore = useCalendarStore();

function getClosestMonday(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
}

onMounted(() => {
  calendarStore.getMealsForWeek(getClosestMonday(new Date()));
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="date in weekDates" :key="date.id">
          {{ date.dayName }}<br>
          {{ date.id.split('-')[2] }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="date in weekDates" :key="date.id">
          <input 
            type="text" 
            :value="getMeal(date.id)"
            @input="event => updateMeal(date.id, event.target.value)"
            placeholder="Add meal..."
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>


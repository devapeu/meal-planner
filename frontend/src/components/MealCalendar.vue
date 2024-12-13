<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCalendarStore } from '../stores/useCalendar'
import NewMealRow from './NewMealRow.vue'

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

function grabDate(day) {
  const date = new Date(day);
  date.setHours(0, 0, 0, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
        <tr>
          <td 
            v-for="(day, index) in daysOfWeek" :key="index"
            @click="console.log(day)">
            <template v-for="{id, meal, start_date, end_date} in calendarStore.calendar">
              <div 
                v-if="start_date === grabDate(day)"
                :key="`start-${id}`"
                class="start-cell"
                :class="{ 'single-cell': start_date === end_date }"
                @click.stop="null">
                <button @click="calendarStore.deleteMeal(id)">&times;</button>
                {{ meal }}
              </div>
              <div 
                v-else-if="start_date < grabDate(day) && end_date > grabDate(day)"
                :key="`middle-${id}`"
                class="middle-cell"
                @click.stop="null">
                {{ meal }}
              </div>
              <div 
                v-else-if="end_date === grabDate(day)"
                :key="`end-${id}`"
                class="end-cell"
                @click.stop="null">
                {{ meal }}!!!
              </div>
            </template>
          </td>
        </tr>
        <NewMealRow :daysOfWeek="daysOfWeek" />
      </tbody>
    </table>
  </div>
</template>

<style>

td {
  padding: 0;
  vertical-align: top;
}

[class*="cell"] {
  height: 20px;
}

.start-cell {
  background: teal;
}

.middle-cell, .end-cell {
  opacity: 0.5;
}
</style>
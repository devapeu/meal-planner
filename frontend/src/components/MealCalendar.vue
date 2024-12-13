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
    <div class="calendar">
      <div 
        v-for="day in daysOfWeek" 
        :key="day"
        class="day-cell"
        :class="{ 'today': day.toDateString() === new Date().toDateString() }">
        {{ day.getDate() }}
      </div>
      <template v-for="day in daysOfWeek">
        <template v-for="{id, meal, start_date, end_date, duration} in calendarStore.calendar">
          <div 
            v-if="start_date === grabDate(day)"
            :key="`meal-${day}-${id}`"
            class="cell"
            :class="{ 'single-cell': start_date === end_date }"
            :style="{ gridColumn: `${day.getDay()} / span ${duration}` }"
            @click.stop="null">
            <button @click="calendarStore.remove(id)">&times;</button>
            {{ meal }}
          </div>
        </template>
      </template>
      <NewMealRow :daysOfWeek="daysOfWeek" />
    </div>
  </div>
</template>

<style>
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(20px, auto);
  border: 1px solid black;
}

.cell {
  border: 1px solid black;
  background: lightgray;
}
</style>
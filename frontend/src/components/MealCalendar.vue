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
        <template v-for="{id, meal, start_date, duration} in calendarStore.calendar">
          <div 
            v-if="start_date === grabDate(day)"
            :key="`meal-${day}-${id}`"
            class="cell"
            :style="{ gridColumn: `${day.getDay()} / span ${duration}` }">
            <button @click="calendarStore.remove(id)">&times;</button>
            {{ meal }}
          </div>
        </template>
      </template>
      <NewMealRow :daysOfWeek="daysOfWeek" />
    </div>
    <div class="calendar-responsive">
      <div 
        v-for="day in daysOfWeek" 
        :key="day"
        class="day-cell"
        :class="{ 'today': day.toDateString() === new Date().toDateString() }">
        {{ day.getDate() }}
      </div>
      <div 
        v-for="day in daysOfWeek" 
        :key="day"
        class="day-cell-2"
        :style="{ gridRowStart: `${day.getDay()}` }">
        <template 
          v-for="{id, meal, start_date, end_date} in calendarStore.calendar">
          <div 
            v-if="grabDate(day) >= start_date && grabDate(day) <= end_date"
            class="meal-cell"
            :key="`meal-${day}-${id}`">
            {{ meal }}
          </div>
        </template>
      </div>
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

.calendar-responsive {
  display: grid;
  grid-auto-rows: minmax(20px, auto);
  grid-template-columns: 50px 1fr min-content;
  border: 1px solid black;
}

.calendar-responsive .day-cell {
  border: 1px solid black;
  grid-column: 1 / span 1;
}

.calendar-responsive .day-cell-2 {
  border: 1px solid black;
  grid-column: 2 / span 1;
}

.calendar-responsive .new-row {
  grid-column: 3 / span 1;
  grid-row: 1 / span 7;
  grid-template-rows: subgrid;
}

.calendar-responsive .meal-cell {
  border: 1px solid black;
  background: lightgray;
  margin: 2px;
}

.cell {
  border: 1px solid black;
  background: lightgray;
}
</style>
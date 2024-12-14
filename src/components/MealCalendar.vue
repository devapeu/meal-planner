<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCalendarStore } from '../stores/useCalendar'
import { getColorFromId } from '../components/getColorFromId'
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

function getAdjacentWeek(direction) {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() + direction * 7);
  selectedDate.value = date.toISOString().split('T')[0];
}

watch(selectedDate, () => {
  calendarStore.getMealsForWeek(selectedDate.value);
});

onMounted(() => {
  calendarStore.getMealsForWeek(selectedDate.value);
});

</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <h2>Weekly Meals</h2>
      <div class="calendar-header__buttons">
        <button @click="getAdjacentWeek(-1)">&lt;</button>
        <input 
          v-model="selectedDate" 
          type="date" />
        <button @click="getAdjacentWeek(1)">&gt;</button>
      </div>
    </div>
    <div class="calendar">
      <div 
        v-for="day in daysOfWeek" 
        :key="day"
        class="day-cell"
        :class="{ 'day-cell--today': day.toDateString() === new Date().toDateString() }">
        <span class="day-cell__day-text">
          {{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}
        </span>
        <span class="day-cell__date-text">
          {{ day.getDate() }}
        </span>
      </div>
      <template v-if="calendarStore.calendar.length > 0">
        <template v-for="day in daysOfWeek">
          <template v-for="{id, meal, start_date, duration} in calendarStore.calendar">
            <div 
              v-if="start_date === grabDate(day)"
              :key="`meal-${day}-${id}`"
              class="meal-cell"
              :style="{ 
                gridColumn: `${day.getDay()} / span ${duration}`,
                background: getColorFromId(id)
              }">
              {{ meal }}
              <button 
                class="meal-cell__remove-button"
                @click="calendarStore.remove(id)">&times;</button>
            </div>
          </template>
        </template>
      </template>
      <template v-else>
        <div class="no-meals-cell">
          No meals for this week.
        </div>
      </template>
      <NewMealRow :daysOfWeek="daysOfWeek" />
    </div>
    <!-- Responsive -->
    <div class="calendar-responsive">
      <div 
        v-for="day in daysOfWeek" 
        :key="day"
        class="day-cell"
        :class="{ 'day-cell--today': day.toDateString() === new Date().toDateString() }">
        <span class="day-cell__day-text">
          {{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}
        </span>
        <span class="day-cell__date-text">
          {{ day.getDate() }}
        </span>
      </div>
      <template v-if="calendarStore.calendar.length > 0">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="day-cell-2"
          :style="{ gridRowStart: `${day.getDay()}` }">
          <template v-if="calendarStore.calendar.length > 0">
            <template
              v-for="{id, meal, start_date, end_date} in calendarStore.calendar">
              <div
                v-if="grabDate(day) >= start_date && grabDate(day) <= end_date"
                class="meal-cell"
                :style="{ background: getColorFromId(id) }"
                :key="`meal-${day}-${id}`">
                {{ meal }}
              </div>
            </template>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="no-meals-cell">
          No meals for this week.
        </div>
      </template>
      <NewMealRow :daysOfWeek="daysOfWeek" />
    </div>
  </div>
</template>

<style lang="sass">
@use '@/assets/variables' as v

.calendar-wrapper
  display: flex
  flex-direction: column
  gap: 12px
  background: #fff
  padding: 16px
  border-radius: 8px

.calendar 
  display: grid
  grid-template-columns: repeat(7, 1fr)
  grid-auto-rows: minmax(32px, auto)
  padding: 8px
  gap: 4px
  background: v.$cream
  border-radius: 8px
  @media (max-width: 768px)
    display: none

.day-cell
  display: flex
  gap: 4px
  flex-direction: column
  justify-content: flex-start
  align-items: center
  padding: 10px
  &__day-text
    line-height: 1
    @media (max-width: 768px)
      font-size: 14px
  &__date-text
    font-size: 24px
    line-height: 1
    font-weight: 600

.meal-cell
  display: flex
  align-items: center
  justify-content: space-between
  gap: 4px
  background: lightgray
  border-radius: 5px
  margin: 2px
  padding: 4px 8px
  user-select: none
  @media (pointer: fine)
    &:hover
      .meal-cell__remove-button
        display: block
  &__remove-button
    cursor: pointer
    display: none
    height: 20px
    width: 20px
    border: none
    border-radius: 5px
    background: #FF9999
    color: white

.no-meals-cell
  text-align: center
  padding: 20px
  grid-column: 1 / span 7

.calendar-responsive 
  display: none
  grid-auto-rows: minmax(72px, auto)
  grid-template-columns: 64px 1fr 48px
  gap: 8px
  padding: 8px
  background: v.$cream
  border-radius: 8px
  @media (max-width: 768px)
    display: grid

  .no-meals-cell
    display: flex
    align-items: center
    justify-content: center
    grid-column: 2
    grid-row: 1 / span 7

.calendar-responsive .day-cell 
  padding-top: 4px
  grid-column: 1 / span 1

.calendar-responsive .day-cell-2 
  grid-column: 2 / span 1

.calendar-responsive .new-row 
  grid-column: 3 / span 1
  grid-row: 1 / span 7
  grid-template-rows: subgrid

.calendar-header
  display: flex
  justify-content: space-between
  align-items: center
  gap: 8px

.cell 
  border: 1px solid black
  background: lightgray
</style>
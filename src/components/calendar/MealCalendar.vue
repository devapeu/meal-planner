<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCalendarStore } from '@/stores/useCalendar'
import { useSlideoutStore } from '@/stores/useSlideout'
import { getColorFromId } from './getColorFromId.ts'
import NewMealForm from './NewMealForm.vue'
import NewMealRow from './NewMealRow.vue'
import RemoveButton from '@/components/interface/RemoveButton.vue'

const selectedDate = ref(new Date().toISOString().split('T')[0]);

const calendarStore = useCalendarStore();
const slideoutStore = useSlideoutStore();

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

function responsiveAddMeal(day) {
  day.setHours(0, 0, 0, 0);
  slideoutStore.open(NewMealForm, { 
    startDate: day.toISOString().split('T')[0], 
    endDate: day.toISOString().split('T')[0],
  })
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
                gridColumn: `${day.getDay() || 7} / span ${duration}`,
                background: getColorFromId(id)
              }">
              {{ meal }}
              <button 
                class="meal-cell__remove-button"
                @click="calendarStore.remove(id, start_date)">&times;</button>
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
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="day-cell-2"
        :style="{ gridRowStart: `${day.getDay() || 7}` }">
        <template v-if="calendarStore.calendar.length > 0">
          <template
            v-for="{id, meal, start_date, end_date} in calendarStore.calendar">
            <div
              v-if="grabDate(day) >= start_date && grabDate(day) <= end_date"
              class="meal-cell"
              :style="{ background: getColorFromId(id) }"
              :key="`meal-${day}-${id}`">
              {{ meal }}
              <RemoveButton @click="calendarStore.remove(id, start_date)" />
            </div>
          </template>
        </template>
        <button 
          class="add-button"
          @click="responsiveAddMeal(day)">&plus;</button>
      </div>
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
  border: 1px solid v.$background-200

.calendar 
  display: grid
  grid-template-columns: repeat(7, 1fr)
  grid-auto-rows: minmax(32px, auto)
  padding: 8px
  gap: 4px
  background: v.$cream
  border: 1px solid v.$wine
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
  border: 1px solid transparent
  border-radius: 5px
  &__day-text
    line-height: 1
    @media (max-width: 768px)
      font-size: 14px
  &__date-text
    font-size: 24px
    line-height: 1
    font-weight: 600
  &--today
    background: #ffebeb
    border-color: v.$accent

.meal-cell
  display: flex
  align-items: center
  justify-content: space-between
  gap: 4px
  background: lightgray
  border: 1px solid v.$wine
  border-radius: 5px
  padding: 4px 8px
  user-select: none
  white-space: nowrap
  @media (pointer: fine)
    &:hover
      .meal-cell__remove-button
        display: flex
  &__remove-button
    cursor: pointer
    display: none
    align-items: center
    justify-content: center
    height: 20px
    min-width: unset!important
    padding: 0!important
    width: 20px!important
    border: none
    border-radius: 5px
    background: #FF9999
    color: white
    border: 1px solid v.$wine
    @media (pointer: fine)
      &:hover
        background: v.$background-300

.no-meals-cell
  text-align: center
  padding: 20px
  grid-column: 1 / span 7

.calendar-responsive 
  display: none
  grid-auto-rows: minmax(72px, auto)
  grid-template-columns: 64px 1fr
  gap: 12px 4px
  padding: 8px
  background: v.$cream
  border-radius: 8px
  border: 1px solid v.$wine
  @media (max-width: 768px)
    display: grid

  .no-meals-cell
    display: flex
    align-items: center
    justify-content: center
    grid-column: 2
    grid-row: 1 / span 7

  .day-cell 
    padding-top: 4px
    grid-column: 1 / span 1

  .day-cell-2 
    display: flex
    flex-direction: column
    gap: 4px
    grid-column: 2 / span 1

  .add-button
    background: transparent
    height: 32px
    border: 1px solid v.$background
    &:hover
      color: v.$accent
      border-color: v.$accent

.calendar-header
  display: flex
  justify-content: space-between
  align-items: center
  gap: 8px
  @media (max-width: 768px)
    flex-direction: column
    align-items: flex-start
    .calendar-header__buttons
      width: 100%
      input
        flex: 1
  &__buttons
    display: flex
    gap: 4px
  button
    width: 32px
    background: v.$background
    cursor: pointer
    &:hover
      background: v.$cream-200
  input
    background: v.$cream
  button, input
    border: 1px solid v.$wine
    height: 32px

.cell 
  border: 1px solid black
  background: lightgray
</style>
<script setup>
import { ref } from 'vue'
import { useCalendarStore } from '../stores/useCalendar'

const calendarStore = useCalendarStore()

const meal = ref('')
const startDate = ref('')
const endDate = ref('')

const showPopup = ref(false)
const isAdding = ref(false)

const props = defineProps({
  daysOfWeek: {
    type: Array,
    required: true
  }
})

function onMouseDown(day) {
  isAdding.value = true
  day.setHours(0, 0, 0, 0);
  startDate.value = day.toISOString().split('T')[0]
}

function onMouseUp(day) {
  isAdding.value = false
  day.setHours(0, 0, 0, 0);
  endDate.value = day.toISOString().split('T')[0]
  showPopup.value = true
}

function addMeal() {
  calendarStore.add(meal.value, startDate.value, endDate.value)
  meal.value = ''
  startDate.value = ''
  endDate.value = ''
  showPopup.value = false
}
</script>

<template>
  <div class="row">
    <div 
      v-if="showPopup"
      class="popup">
      <input type="text" v-model="meal" placeholder="Meal" />
      <input type="date" v-model="startDate" placeholder="Start Date" />
      <input type="date" v-model="endDate" placeholder="End Date" />
      <button @click="addMeal">Add</button>
      <button @click="showPopup = false">Cancel</button>
    </div>
    <div v-for="day in daysOfWeek" :key="day">
      <button 
        @mousedown="onMouseDown(day)" 
        @mouseup="onMouseUp(day)">&plus;</button>
    </div>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.popup {
  box-sizing: border-box;
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

</style>
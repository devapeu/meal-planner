<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCalendarStore } from '@/stores/useCalendar'
import { useRecipesStore } from '@/stores/useRecipes'

const calendarStore = useCalendarStore()
const recipesStore = useRecipesStore()

const meal = ref('')
const startDate = ref('')
const endDate = ref('')
const customMeal = ref('')
const showPopup = ref(false)
const isAdding = ref(false)

const props = defineProps({
  daysOfWeek: {
    type: Array,
    required: true
  }
})

const duration = computed(() => {
  return new Date(endDate.value).getDate() - new Date(startDate.value).getDate() + 1
})

const durationText = computed(() => {
  const messages = {
    2: 'Nice.',
    3: 'Perfect.',
    4: 'Wow!',
    5: 'WOW!!!',
  }
  const funText = duration.value >= 5 ? 'What are we gonna do with so much food!?' : messages[duration.value] || ''
  return `That's ${duration.value} ${duration.value === 1 ? 'day' : 'days'} of ${chosenMeal.value}. ${funText}`
})

const showDuration = computed(() => {
  return duration.value && chosenMeal.value
})

const chosenMeal = computed(() => {
  return meal.value === 'custom' ? customMeal.value : meal.value
})

function onMouseDown(day) {
  isAdding.value = true
  day.setHours(0, 0, 0, 0);
  startDate.value = day.toISOString().split('T')[0]
}

function onMouseUp(day, event) {
  console.log(event)
  isAdding.value = false
  day.setHours(0, 0, 0, 0);
  endDate.value = day.toISOString().split('T')[0]
  showPopup.value = true
}

function addMeal() {
  calendarStore.add(chosenMeal.value, startDate.value, endDate.value)
  reset()
}

function reset() {
  meal.value = ''
  customMeal.value = ''
  startDate.value = ''
  endDate.value = ''
  showPopup.value = false
}

onMounted(() => {
  recipesStore.get()
})

watch(showPopup, (newVal) => {
  if (!newVal) {
    reset()
  }
})
</script>

<template>
  <div class="new-row">
    <div 
      v-if="showPopup"
      class="popup">
      <select v-model="meal">
        <option 
          v-for="recipe in recipesStore.recipes" 
          :key="recipe.id" 
          :value="recipe.name">{{ recipe.name }}</option>
        <option value="custom">Custom</option>
      </select>
      <input 
        v-if="meal === 'custom'" 
        type="text" 
        v-model="customMeal" 
        placeholder="What will you have?" />
      <div class="popup__input">
        <input type="date" v-model="startDate" placeholder="Start Date" />
        <input type="date" v-model="endDate" :min="startDate" placeholder="End Date" />
      </div>
      <div 
        v-if="showDuration"
        class="popup__duration">{{ durationText }}</div>
      <div class="popup__buttons">
        <button @click="showPopup = false">Cancel</button>
        <button @click="addMeal">Add</button>
      </div>
    </div>
    <div 
      v-for="day in daysOfWeek" 
      :key="day"
      class="new-row__cell">
      <button 
        class="add-button"
        @mousedown="onMouseDown(day)" 
        @mouseup="onMouseUp(day, $event)">&plus;</button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.new-row 
  position: relative
  display: grid
  grid-column: 1 / -1
  grid-template-columns: subgrid
  &__cell
    padding: 2px

.add-button 
  height: 100%
  width: 100%
  border: none
  cursor: pointer
  background: white
  font-weight: 600
  &:hover
    background: #f3f4f6

.popup 
  display: flex
  flex-direction: column
  gap: 8px
  padding: 8px
  position: fixed
  top: 0
  left: 0
  width: 300px
  background-color: white
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5)
  &__input, &__buttons
    display: flex
    gap: 8px
  &__buttons
    justify-content: flex-end
  &__duration
    font-size: 12px
    font-style: italic
    color: #6b7280
  input
    width: 100%
  @media (max-width: 768px)
    top: 0
    left: 0
</style>
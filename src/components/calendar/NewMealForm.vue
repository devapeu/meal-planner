<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCalendarStore } from '@/stores/useCalendar'
import { useRecipesStore } from '@/stores/useRecipes'

const props = defineProps({
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  },
})

const calendarStore = useCalendarStore()
const recipesStore = useRecipesStore()

const meal = ref('')
const startDate = ref('')
const endDate = ref('') 
const customMeal = ref('')

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
  const today = new Date();
  today.setHours(0,0,0)
  startDate.value = props.startDate ?? today.toISOString().split('T')[0];
  endDate.value = props.endDate ?? today.toISOString().split('T')[0];
})
</script>

<template>
  <div class="new-meal">
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
    <div class="new-meal__input">
      <input type="date" v-model="startDate" placeholder="Start Date" />
      <input type="date" v-model="endDate" :min="startDate" placeholder="End Date" />
    </div>
    <div 
      v-if="showDuration"
      class="new-meal__duration">{{ durationText }}</div>
    <div class="new-meal__buttons">
      <button @click="$emit('close')">Cancel</button>
      <button @click="addMeal">Add</button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.new-meal-form 
  display: flex
  flex-direction: column
  gap: 8px
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
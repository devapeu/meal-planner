<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCalendarStore } from '@/stores/useCalendar'
import { useRecipesStore } from '@/stores/useRecipes'

const emit = defineEmits(['close'])
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
  emit('close');
}

onMounted(() => {
  const today = new Date();
  today.setHours(0,0,0)
  startDate.value = props.startDate ?? today.toISOString().split('T')[0];
  endDate.value = props.endDate ?? today.toISOString().split('T')[0];
})
</script>

<template>
  <div class="new-meal-form">
    <select v-model="meal">
      <option value="" disabled selected>Select your option</option>
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
    <div class="new-meal-form__input">
      <input type="date" v-model="startDate" placeholder="Start Date" />
      <input type="date" v-model="endDate" :min="startDate" placeholder="End Date" />
    </div>
    <div 
      v-if="showDuration"
      class="new-meal-form__duration">{{ durationText }}</div>
    <div class="new-meal-form__buttons">
      <button @click="emit('close')">Cancel</button>
      <button @click="addMeal">Add</button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as v

.new-meal-form 
  display: flex
  flex-direction: column
  gap: 8px
  &__input
    display: flex
    gap: 4px
  &__input, &__buttons
    display: flex
    gap: 8px
  &__buttons
    justify-content: flex-end
    button
      font-size: 16px
      height: 32px
      padding: 2px 16px
      border: none
    button:first-child
      background: white
    button:last-child
      background-color: v.$background
  &__duration
    font-size: 14px
    font-style: italic
    color: v.$burgundy
  input
    display: block
  select, input
    width: 100%
    height: 36px
    padding: 0 12px
    border: 1px solid v.$accent
  @media (max-width: 768px)
    top: 0
    left: 0
</style>
<script setup>
import { ref } from 'vue'
import NewMealForm from './NewMealForm.vue'

const showPopup = ref(false)
const isAdding = ref(false)
const startDate = ref('')
const endDate = ref('')

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
</script>

<template>
  <div class="new-row">
    <div 
      v-if="showPopup"
      class="popup">
      <NewMealForm @close="showPopup = false" />
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
@use '@/assets/variables' as v

.new-row 
  position: relative
  display: grid
  grid-column: 1 / -1
  grid-template-columns: subgrid

.add-button 
  height: 100%
  width: 100%
  border: none
  cursor: pointer
  background: white
  font-weight: 600
  border-radius: 4px
  border: 1px solid v.$background
  &:hover
    color: v.$accent
    border-color: v.$accent

.popup 
  padding: 12px
  position: fixed
  top: 0
  left: 0
  background-color: v.$cream
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5)
  @media (max-width: 768px)
    top: 0
    left: 0
</style>
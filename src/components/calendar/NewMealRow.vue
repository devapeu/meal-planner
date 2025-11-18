<script setup>
import { ref, useTemplateRef } from 'vue'
import NewMealForm from './NewMealForm.vue'

const showPopup = ref(false)
const isAdding = ref(false)
const startDate = ref('')
const endDate = ref('')

const $popup = useTemplateRef('new-meal-popup');

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

function onMouseUp(day, event) {
  // configure position of popup
  let position = event.target.getBoundingClientRect();

  // place vertically right below at button position, horizontally centered
  let topPos = position.top + position.height + 8;
  let leftPos = position.left - 150 + (position.width / 2)

  $popup.value.style.top = topPos + "px";
  $popup.value.style.left = leftPos + "px";

  isAdding.value = false

  // configure date values
  day.setHours(0, 0, 0, 0);
  endDate.value = day.toISOString().split('T')[0];

  // show popup
  showPopup.value = true
}

</script>

<template>
  <div class="new-row">
    <Transition name="slide-down">
      <div 
        v-show="showPopup"
        class="popup"
        ref="new-meal-popup">
        <NewMealForm @close="showPopup = false" />
      </div>
    </Transition>
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
  position: absolute
  top: 0
  left: 0
  background-color: v.$cream
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5)
  @media (max-width: 768px)
    top: 0
    left: 0
</style>
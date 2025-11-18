<script setup>
import { ref, useTemplateRef, watch } from 'vue'
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
  startDate.value = day.toISOString().split('T')[0];
  endDate.value = day.toISOString().split('T')[0];

  // show popup
  showPopup.value = true
}

watch(showPopup, () => {
  $popup.value.top = "0";
  $popup.value.left = "0";
})

</script>

<template>
  <div class="new-row">
    <Transition name="slide-down">
      <div 
        v-show="showPopup"
        class="popup"
        ref="new-meal-popup">
        <NewMealForm 
          :start-date="startDate"
          :end-date="endDate"
          @close="showPopup = false" />
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
  transition: top 200ms cubic-bezier(0,1,.5,1), left 200ms cubic-bezier(0,1,.5,1)
  box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075)
  @media (max-width: 768px)
    top: 0
    left: 0
</style>
import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue'

const HEADER_LIST = {
  "RecipesForm": "Add Recipe",
  "NewMealForm": "Add Meal to Calendar",
}

export const useSlideoutStore = defineStore('slideout', () => {
  const component = ref(null)
  const props = ref({})
  const isOpen = ref(false)
  const header = ref("");

  function open(c, p, h = null) {
    isOpen.value = true
    header.value = h ?? HEADER_LIST[c.__name];
    component.value = markRaw(c)
    props.value = p
  }

  function close() {
    isOpen.value = false
    component.value = null
    props.value = {}
  }

  return {
    isOpen,
    header,
    component,
    props,
    open,
    close
  }
})
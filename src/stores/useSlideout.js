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

  function open(component, propsArr, slideoutHeader) {
    isOpen.value = true
    const componentName = component.__name;
    if (slideoutHeader) {
      header.value = slideoutHeader
    } else {
      header.value = HEADER_LIST[componentName];
    }
    component.value = markRaw(component)
    props.value = propsArr
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
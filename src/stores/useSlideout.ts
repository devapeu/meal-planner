import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue'

export const useSlideoutStore = defineStore('slideout', () => {
  const component = ref(null)
  const props = ref({})
  const isOpen = ref(false)

  function open(c, p) {
    isOpen.value = true
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
    component,
    props,
    open,
    close
  }
})
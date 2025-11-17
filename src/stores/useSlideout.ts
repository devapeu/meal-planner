import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue'
import type { Component, ExtractPropTypes } from 'vue';

export const useSlideoutStore = defineStore('slideout', () => {
  const component = ref<Component | null>(null)
  const props = ref<Record<string, any>>({})
  const isOpen = ref(false)

  function open<T extends Component>(c: T, p?: T extends { props?: infer P } ? ExtractPropTypes<P> : Record<string, any>) {
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
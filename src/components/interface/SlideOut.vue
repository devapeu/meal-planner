<script setup>
import { useSlideoutStore } from '@/stores/useSlideout'

const slideoutStore = useSlideoutStore()

</script>

<template>
  <div class="slide-out" @click="slideoutStore.close">
    <div class="slide-out-inner" @click.stop>
      <component 
        :is="slideoutStore.component" 
        v-bind="slideoutStore.props"
        @close="slideoutStore.close"/>
    </div>
  </div>
</template>

<style lang="sass">
@use '@/assets/variables' as v
.slide-out
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1000

.slide-out-inner
  position: absolute
  background: v.$cream
  top: 0
  right: 0
  width: 480px
  height: 100%
  z-index: 1000
  padding: 20px
  padding-bottom: 72px
  box-shadow: -10px -10px 50px 10px rgba(0, 0, 0, 0.1), 0 0 10px 0 rgba(0, 0, 0, 0.5)
  overflow: scroll
  @media (max-width: 768px)
    height: 75vh
    top: initial
    bottom: 0
    right: 0
    left: 0
    width: 100%
</style>
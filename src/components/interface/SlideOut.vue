<script setup>
import { useSlideoutStore } from '@/stores/useSlideout'

const slideoutStore = useSlideoutStore()

</script>

<template>
  <div class="slide-out" @click="slideoutStore.close">
    <div class="slide-out-inner" @click.stop>
      <component 
        :is="slideoutStore.component" 
        v-bind="slideoutStore.props" />
    </div>
  </div>
</template>

<style lang="sass">
.slide-out
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1000
  background: rgba(0, 0, 0, 0.1)

.slide-out-inner
  position: absolute
  background: #fff
  top: 0
  right: 0
  width: 480px
  height: 100%
  z-index: 1000
  padding: 20px
  @media (max-width: 768px)
    height: 75vh
    top: initial
    bottom: 0
    right: 0
    left: 0
    width: 100%
</style>
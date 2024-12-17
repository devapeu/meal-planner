<script setup>
</script>

<template>
  <button class="remove-button">&times;</button>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as v

.remove-button
  cursor: pointer
  color: v.$accent
  background: none
  height: 24px
  width: 24px
  border: none
  font-size: 20px
  display: inline-flex
  align-items: center
  justify-content: center
  transition: all 100ms ease-in-out
  border: 1px solid transparent
  @media (pointer: fine)
    &:hover
      background: v.$cream
      border: 1px solid v.$accent
</style>

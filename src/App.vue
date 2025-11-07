<script setup>
import { useRoute } from 'vue-router'
import { useSlideoutStore } from '@/stores/useSlideout'
import { NDrawer, NDrawerContent, NTooltip } from 'naive-ui'
import { Bbq, Calendar, OrganicFood } from '@iconoir/vue'

const route = useRoute()
const slideoutStore = useSlideoutStore()  
</script>

<template>
  <nav class="navigation">
    <div class="navigation__brand">
      <OrganicFood width="32" height="32" />
      <h1>Meal Planner</h1>
    </div>
    
    <ul class="navigation__menu">
      <li>
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <router-link to="/" :class="{ active: route.path === '/' }">
              <Calendar width="24" height="24"/>
            </router-link>
          </template>
          Meal Planner
        </n-tooltip>
      </li>
      <li>
        <n-tooltip placement="right" trigger="hover">
          <template #trigger>
            <router-link to="/recipes" :class="{ active: route.path.includes('/recipes') }">
              <Bbq width="24" height="24"/>
            </router-link>
          </template>
          Recipes
        </n-tooltip>
      </li>
    </ul>
  </nav>
  <RouterView class="router-view" />
  <n-drawer
    v-model:show="slideoutStore.isOpen"
    placement="right"
    width="clamp(auto, 100%, 480px)"
    class="slideout"
    :mask-closable="true">
    <n-drawer-content>
      <template #header>
        <div class="slideout__header">
          {{ slideoutStore.header }}
        </div>
      </template>
      <component
        v-if="slideoutStore.component"
        :is="slideoutStore.component"
        v-bind="slideoutStore.props"
        @close="slideoutStore.close" />
      <template #footer>
        <button @click="slideoutStore.close">Close</button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="sass">
@use '@/assets/variables' as *
#app
  min-height: 100svh
  @media (min-width: 768px)
    display: grid
    grid-template-columns: auto 1fr

.navigation
  background: $background
  padding: 16px 8px
  display: flex
  flex-direction: column
  align-items: center
  border-right: 1px solid $background-200

  &__brand
    text-align: center
    width: 100%
    h1
      font-size: 0
      margin: 0
    svg
      color: $accent

  &__menu
    list-style: none
    padding: 0
    margin: 0
    width: 100%
    display: flex
    flex-direction: column
    gap: 8px
    flex: 1

    a
      height: 54px
      width: 54px
      border-radius: 8px
      display: flex
      align-items: center
      justify-content: center
      color: inherit
      transition: all 0.2s ease
      
      @media (pointer: fine)
        &:hover,&.active
          background-color: $background-200
          color: $accent

      &.active
        background-color: $background-300
        color: white

.router-view
  overflow-y: scroll
  max-height: 100vh

header
  display: flex
  align-items: center
  gap: 8px
  h1
    margin: 0
.slideout
  max-width: 480px
  background: $cream
  &__header
    font-size: 24px
</style>
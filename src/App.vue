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
        <n-tooltip placement="right" trigger="hover" display-directive="show">
          <template #trigger>
            <router-link to="/" :class="{ active: route.path === '/' }">
              <Calendar width="24" height="24"/>
              <div class="navigation__menu__label">
                Meal Planner
              </div>
            </router-link>
          </template>
          Meal Planner
        </n-tooltip>
      </li>
      <li>
        <n-tooltip placement="right" trigger="hover" display-directive="show">
          <template #trigger>
            <router-link to="/recipes" :class="{ active: route.path.includes('/recipes') }">
              <Bbq width="24" height="24"/>
              <div class="navigation__menu__label">
                Recipes
              </div>
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
  height: 100svh
  display: grid
  grid-template-rows: 1fr auto
  @media (min-width: 768px)
    grid-template-rows: auto
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
    &__label
      display: none
      font-weight: 500

    a
      height: 54px
      width: 54px
      border-radius: 8px
      display: flex
      align-items: center
      justify-content: center
      color: $wine
      transition: all 0.2s ease
      text-decoration: none
      
      @media (pointer: fine)
        &:hover
          color: $accent

      &.active
        background-color: $background-200

  @media (max-width: 768px)
    order: 2
    padding: 8px
    &__brand
      display: none
    &__menu
      flex-direction: row
      li
        flex: 1
      a
        height: auto
        width: auto
        padding: 8px 4px
        flex-direction: column
        svg
          width: 28px!important
          height: 28px!important
      &__label
        display: inline

.router-view
  overflow-y: scroll
  max-height: 100vh
  width: 100%

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

@media (pointer: coarse)
  .n-popover
    display: none
</style>
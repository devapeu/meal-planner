<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useSlideoutStore } from '@/stores/useSlideout'
import { useAuthStore } from '@/stores/useAuth'
import { NDrawer, NTooltip } from 'naive-ui'
import { Bbq, Calendar, IconoirProvider, LogOut } from '@iconoir/vue'
import Pepper from './components/icons/Pepper.vue'

const route = useRoute()
const router = useRouter()
const slideoutStore = useSlideoutStore()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav v-if="authStore.isAuthenticated" class="navigation">
    <div class="navigation__brand">
      <Pepper class="navigation__brand-icon"/>
      <h1>Meal Planner</h1>
    </div>

    <ul class="navigation__menu">
      <li>
        <n-tooltip placement="right" trigger="hover" display-directive="show">
          <template #trigger>
            <router-link to="/" :class="{ active: route.path === '/' }">
              <IconoirProvider>
                <Calendar width="24" height="24"/>
              </IconoirProvider>
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
              <IconoirProvider>
                <Bbq width="24" height="24"/>
              </IconoirProvider>
              <div class="navigation__menu__label">
                Recipes
              </div>
            </router-link>
          </template>
          Recipes
        </n-tooltip>
      </li>
    </ul>

    <div class="navigation__logout">
      <n-tooltip placement="right" trigger="hover" display-directive="show">
        <template #trigger>
          <button @click="handleLogout" class="logout-btn">
            <IconoirProvider>
              <LogOut width="24" height="24"/>
            </IconoirProvider>
            <div class="navigation__menu__label">
              Logout
            </div>
          </button>
        </template>
        Logout
      </n-tooltip>
    </div>
  </nav>
  <RouterView class="router-view" />
  <n-drawer
    v-model:show="slideoutStore.isOpen"
    placement="right"
    width="clamp(auto, 100%, 480px)"
    class="slideout"
    :mask-closable="true"
    @after-leave="slideoutStore.cleanup">
    <component
      v-if="slideoutStore.component"
      :is="slideoutStore.component"
      v-bind="slideoutStore.props"
      @close="slideoutStore.close" />
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

  &__logout
    margin-top: auto
    width: 100%

    .logout-btn
      height: 54px
      width: 54px
      border-radius: 8px
      display: flex
      align-items: center
      justify-content: center
      color: $wine
      transition: all 0.2s ease
      text-decoration: none
      background: none
      border: none
      cursor: pointer

      @media (pointer: fine)
        &:hover
          color: $accent

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
    &__logout
      .logout-btn
        height: auto
        width: auto
        padding: 8px 4px
        flex-direction: column
        svg
          width: 28px!important
          height: 28px!important

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
  &__buttons
    display: flex
    gap: 10px

.n-drawer .n-drawer-content
  .n-drawer-header, .n-drawer-footer
    border-color: $background

@media (pointer: coarse)
  .n-popover
    display: none
</style>
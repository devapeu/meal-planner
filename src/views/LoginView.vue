<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import FormField from '@/components/interface/FormField.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  const success = await authStore.login(username.value, password.value)
  loading.value = false

  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Login</h1>

      <div v-if="authStore.error" class="auth-error">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <FormField
          v-model="username"
          label="Username"
          placeholder="Enter your username"
          :disabled="loading"
          required
        />

        <FormField
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :disabled="loading"
          required
        />

        <div class="auth-actions">
          <button type="submit" class="btn-accent" :disabled="loading">
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
          <p>
            Don't have an account? <router-link to="/register">Register</router-link>.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

.auth-container
  display: flex
  justify-content: center
  align-items: center
  min-height: 80vh
  width: 100vw
  padding: 1rem

.auth-card
  width: 100%
  max-width: 400px
  background: white
  padding: 2rem
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  h1
    margin-bottom: 1.5rem
    color: $wine

.auth-error
  background: $cream-200
  border: 1px solid $accent
  color: $burgundy
  padding: 12px
  border-radius: 4px
  margin-bottom: 1rem
  font-size: 14px

.auth-form
  display: flex
  flex-direction: column
  gap: 1rem

.auth-actions
  display: flex
  flex-direction: column
  gap: 0.5rem
  margin-top: 0.5rem

  a:visited
    color: $accent

  button
    width: 100%
    height: 40px
    font-size: 16px

    &:disabled
      opacity: 0.5
      cursor: not-allowed
</style>

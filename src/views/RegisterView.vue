<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import FormField from '@/components/interface/FormField.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const validationError = ref('')

async function handleRegister() {
  validationError.value = ''

  if (password.value !== confirmPassword.value) {
    validationError.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    validationError.value = 'Password must be at least 8 characters'
    return
  }

  loading.value = true
  const success = await authStore.register(username.value, password.value, email.value)
  loading.value = false

  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Register</h1>

      <div v-if="validationError || authStore.error" class="auth-error">
        {{ validationError || authStore.error }}
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <FormField
          v-model="username"
          label="Username"
          placeholder="Choose a username"
          :disabled="loading"
          required
        />

        <FormField
          v-model="email"
          type="email"
          label="Email (optional)"
          placeholder="Enter your email"
          :disabled="loading"
        />

        <FormField
          v-model="password"
          type="password"
          label="Password"
          placeholder="Choose a password"
          :disabled="loading"
          :minlength="8"
          required
        />

        <FormField
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          :disabled="loading"
          :minlength="8"
          required
        />

        <div class="auth-actions">
          <button type="submit" class="btn-accent" :disabled="loading">
            {{ loading ? 'Loading...' : 'Register' }}
          </button>
          <p>Already have an account? <router-link to="/login">Login</router-link>.</p>
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { NForm, NFormItem, NInput, NButton, NCard, NAlert } from 'naive-ui'

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

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="auth-container">
    <NCard title="Register" class="auth-card">
      <NAlert
        v-if="validationError || authStore.error"
        type="error"
        :title="validationError || authStore.error"
        style="margin-bottom: 1rem"
      />

      <NForm @submit.prevent="handleRegister">
        <NFormItem label="Username">
          <NInput
            v-model:value="username"
            placeholder="Choose a username"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="Email (optional)">
          <NInput
            v-model:value="email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="Password">
          <NInput
            v-model:value="password"
            type="password"
            placeholder="Choose a password"
            show-password-on="click"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="Confirm Password">
          <NInput
            v-model:value="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            show-password-on="click"
            @keyup.enter="handleRegister"
            :disabled="loading"
          />
        </NFormItem>

        <div class="auth-actions">
          <NButton type="primary" @click="handleRegister" :loading="loading" block>
            Register
          </NButton>
          <NButton text @click="goToLogin" :disabled="loading">
            Already have an account? Login
          </NButton>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<style lang="sass" scoped>
.auth-container
  display: flex
  justify-content: center
  align-items: center
  min-height: 80vh
  padding: 1rem

.auth-card
  width: 100%
  max-width: 400px

.auth-actions
  display: flex
  flex-direction: column
  gap: 0.5rem
  margin-top: 1rem
</style>

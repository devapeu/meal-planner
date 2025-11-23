<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuth'
import { NForm, NFormItem, NInput, NButton, NCard, NAlert } from 'naive-ui'

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

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="auth-container">
    <NCard title="Login" class="auth-card">
      <NAlert v-if="authStore.error" type="error" :title="authStore.error" style="margin-bottom: 1rem" />

      <NForm @submit.prevent="handleLogin">
        <NFormItem label="Username">
          <NInput
            v-model:value="username"
            placeholder="Enter your username"
            @keyup.enter="handleLogin"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="Password">
          <NInput
            v-model:value="password"
            type="password"
            placeholder="Enter your password"
            show-password-on="click"
            @keyup.enter="handleLogin"
            :disabled="loading"
          />
        </NFormItem>

        <div class="auth-actions">
          <NButton type="primary" @click="handleLogin" :loading="loading" block>
            Login
          </NButton>
          <NButton text @click="goToRegister" :disabled="loading">
            Don't have an account? Register
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

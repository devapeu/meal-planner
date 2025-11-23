<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minlength?: number
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="form-field">
    <span class="form-field__label">{{ label }}</span>
    <input
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :minlength="minlength"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="form-field__input"
    />
  </label>
</template>

<style lang="sass" scoped>
@use '@/assets/variables' as v

.form-field
  display: flex
  flex-direction: column
  gap: 4px

  &__label
    font-weight: 500
    font-size: 14px
    color: v.$wine

  &__input
    width: 100%

    &:disabled
      opacity: 0.5
      cursor: not-allowed
</style>

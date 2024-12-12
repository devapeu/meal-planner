<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => console.log(route))
</script>

<template>
  <main>
    <h1>Recipes</h1>
    <ul>
      <li>
        <RouterLink to="/arroz-tapado">
          <h2>Arroz Tapado</h2>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

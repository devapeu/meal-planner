<script setup>
import { ref, computed } from 'vue';

const meals = ref([
  { id: '2024-12-09', value: 'Ceviche' },
  { id: '2024-12-10', value: 'Curry' },
  { id: '2024-12-11', value: 'Lentils' },
  { id: '2024-12-12', value: 'Takeout' },
]);

const week = ref(42);

const weekDates = computed(() => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, 1 + ((week.value - 1) * 7) + i);
    dates.push({
      id: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
    });
  }
  return dates;
});

const updateMeal = (date, newValue) => {
  const existingMealIndex = meals.value.findIndex(meal => meal.id === date);
  if (existingMealIndex !== -1) {
    meals.value[existingMealIndex].value = newValue;
  } else {
    meals.value.push({ id: date, value: newValue });
  }
};

const getMeal = (date) => {
  const meal = meals.value.find(meal => meal.id === date);
  return meal ? meal.value : '';
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="date in weekDates" :key="date.id">
          {{ date.dayName }}<br>
          {{ date.id.split('-')[2] }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="date in weekDates" :key="date.id">
          <input 
            type="text" 
            :value="getMeal(date.id)"
            @input="event => updateMeal(date.id, event.target.value)"
            placeholder="Add meal..."
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>


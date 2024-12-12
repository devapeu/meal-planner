import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost/backend';

export const getMealsForDay = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/calendar/${date}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addMealToDay = async (date, meal) => {
  try {
    const response = await axios.post(`${API_URL}/calendar/${date}`, { meal });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

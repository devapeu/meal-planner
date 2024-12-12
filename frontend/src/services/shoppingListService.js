import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost/backend';

export const getShoppingList = async () => {
  try {
    const response = await axios.get(`${API_URL}/shopping-list`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addItemToShoppingList = async (item) => {
  try {
    const response = await axios.post(`${API_URL}/shopping-list`, { item });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

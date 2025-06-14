import { client } from './apiClient';

export const getAllLabels = async () => {
  try {
    const data = await client.expenses.labels.getAll.query();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getExpensesByTime = async () => {
  try {
    const data = await client.stats.expensesByTime.query();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

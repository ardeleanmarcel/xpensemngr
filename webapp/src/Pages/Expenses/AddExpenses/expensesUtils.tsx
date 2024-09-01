import { client } from '../../../api/apiClient';

export const getAllExpenses = async () => {
  try {
    const data = await client.expenses.getAll.query();
    return data;
  } catch (error) {
    return [];
  }
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

import { client } from '../../api/apiClient';
export interface Column {
  id: 'description' | 'amount' | 'date_expended_at' | 'labels';
  label: string;
  minWidth?: number;
  align?: 'center';
}

export interface Data {
  description: string;
  amount: number;
  date_expended_at: string;
  expense_id: number;
  labels: {
    label_id: number;
    name: string;
    description?: string;
  }[];
}

export const columns: Column[] = [
  { id: 'description', label: 'Description', minWidth: 170, align: 'center' },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'date_expended_at',
    label: 'Date',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'labels',
    label: 'Labels',
    minWidth: 170,
    align: 'center',
  },
];

export function createData(
  expenses: {
    description: string;
    amount: number;
    date_expended_at: string;
    expense_id: number;
    labels: {
      label_id: number;
      name: string;
      description?: string;
    }[];
  }[]
): Data[] {
  return expenses.map((expense) => ({
    ...expense,
    date_expended_at: formatDate(expense.date_expended_at),
  }));
}

export const getAllExpenses = async () => {
  try {
    // @ts-expect-error "Property 'getAll' does not exist on type"
    const data = await client.expenses.getAll.query();
    return data;
  } catch (error) {
    return [];
  }
};

export const getAllLabels = async () => {
  try {
    // @ts-expect-error "Property 'getAll' does not exist on type"
    const data = await client.labels.getAll.query();
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

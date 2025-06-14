import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { getExpensesByTime } from '../../../../api/api.endpoints';
import { CardV2 } from '../../../../components/layout/CardV2/CardV2';
import { useRunOnce } from '../../../../hooks/useRunOnce';

interface Data {
  date: string;
  amount: number;
}

export const ExpenseBarChart = () => {
  const [data, setData] = useState<Array<Data>>([]);

  const fetchData = async () => {
    const res = await getExpensesByTime();
    setData(res);
  };

  useRunOnce(() => {
    fetchData();
  });

  return (
    <CardV2 height="400px" width="100%" padding="m" shadow="reduced">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="green" />} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </CardV2>
  );
};

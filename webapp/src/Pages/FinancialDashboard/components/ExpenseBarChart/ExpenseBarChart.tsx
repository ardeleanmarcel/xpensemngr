import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { CardV2 } from '../../../../components/layout/CardV2/CardV2';

const mockData = new Array(14).fill(null).map((_, index) => ({
  date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString('ro-RO'),
  amount: Math.floor(Math.random() * 1000),
}));

export const ExpenseBarChart = () => {
  return (
    <CardV2 height="400px" width="100%" padding="m" shadow="reduced">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} data={mockData}>
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

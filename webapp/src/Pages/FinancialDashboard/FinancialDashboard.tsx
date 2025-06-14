import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { AuthProtected } from '../../components/utils/AuthProtected';
import { ExpenseBarChart } from './components/ExpenseBarChart/ExpenseBarChart';

export const FinancialDashboard = () => {
  return (
    <CardV2 minHeight="100%" padding="l">
      <PageHeader title="Financial Dashboard" />
      <ExpenseBarChart />
    </CardV2>
  );
};

export const ProtectedFinancialDashboard = () => (
  <AuthProtected>
    <FinancialDashboard />
  </AuthProtected>
);

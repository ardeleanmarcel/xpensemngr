import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { AuthProtected } from '../../components/utils/AuthProtected';
import { XpmText } from '../../components/XpmText/XpmText';

export const FinancialDashboard = () => {
  return (
    <CardV2 minHeight="100%">
      <div style={{ height: '200px' }}>
        <XpmText content="Financial Dashboard" size="m" />
      </div>
    </CardV2>
  );
};

export const ProtectedFinancialDashboard = () => (
  <AuthProtected>
    <FinancialDashboard />
  </AuthProtected>
);

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { PAGE, PATH } from '../../../../constants/paths';
import { AccountSettings } from '../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { XpmLogoMain } from '../../../icons/XpmLogoMain/XpmLogoMain';
import { XpmButtonV2 } from '../../../XpmButtonV2/XpmButtonV2';
import { CardV2 } from '../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';
import { AddExpenseDialog } from './AddExpenseDialog';
import { AddLabelDialog } from './AddLabelDialog';

export function MenuNavagationV2() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [isAddLabelDialogOpen, setIsAddLabelDialogOpen] = useState(false);

  console.log('pathname', pathname);

  const secondaryItemText = getAddItemButtonText(pathname);
  const currentPage = getCurrentPage(pathname);

  const handleSecondaryItemClick = () => {
    if (currentPage === PAGE.Labels) {
      setIsAddLabelDialogOpen(true);
    } else if (currentPage === PAGE.Dashboard) {
      console.log('will add dashboard');
    }
  };

  return (
    <>
      <CardV2 height="100%" width="340px">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',

            flex: 0,
          }}
        >
          <XpmLogoMain />
          Xpensemngr
        </div>
        <XpmVerticalSpacer size="m" />
        <XpmHorizontalSeparator width="150px" />
        <XpmVerticalSpacer size="m" />

        <XpmButtonV2 text="Add Expense" onClick={() => setIsAddExpenseDialogOpen(true)} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text={secondaryItemText} onClick={handleSecondaryItemClick} />
        <XpmVerticalSpacer size="m" />
        <XpmHorizontalSeparator width="150px" />

        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Dashboard" onClick={() => navigate(PATH.ExpenseDashboard.Segment)} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Labels" onClick={() => navigate(PATH.ExpenseLabels.Segment)} />
        <div style={{ flex: 1 }} />
        <XpmHorizontalSeparator width="250px" />
        <AccountSettings />
      </CardV2>
      <AddExpenseDialog isOpen={isAddExpenseDialogOpen} onClose={() => setIsAddExpenseDialogOpen(false)} />
      <AddLabelDialog isOpen={isAddLabelDialogOpen} onClose={() => setIsAddLabelDialogOpen(false)} />
    </>
  );
}

function getCurrentPage(path: string): PAGE {
  if (path === PATH.ExpenseLabels.Segment) {
    return PAGE.Labels;
  }

  if (path === PATH.ExpenseDashboard.Segment) {
    return PAGE.Dashboard;
  }

  throw new Error('Unknown page');
}

function getAddItemButtonText(pathname: string): string {
  if (pathname === PATH.ExpenseLabels.Segment) {
    return 'Add Label';
  }

  if (pathname === PATH.ExpenseDashboard.Segment) {
    return 'Add Dashboard';
  }

  return '';
}

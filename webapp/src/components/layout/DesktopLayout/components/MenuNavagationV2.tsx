import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { XpmLogoMain } from '../../../icons/XpmLogoMain/XpmLogoMain';
import { XpmButtonV2 } from '../../../XpmButtonV2/XpmButtonV2';
import { CardV2 } from '../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';
import { AccountSettings } from '../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { AddExpenseDialog } from './AddExpenseDialog';

export function MenuNavagationV2() {
  const navigate = useNavigate();

  const [isAddExpensesDialogOpen, setIsAddExpensesDialogOpen] = useState(false);

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

        <XpmButtonV2 text="Add Expense" onClick={() => setIsAddExpensesDialogOpen(true)} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Add Dashboard" onClick={() => console.log('clicked add dashboard')} />
        <XpmVerticalSpacer size="m" />
        <XpmHorizontalSeparator width="150px" />

        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Dashboard" onClick={() => navigate('expenses-dashboard')} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Labels" onClick={() => navigate('expense-labels')} />
        <div style={{ flex: 1 }} />
        <XpmHorizontalSeparator width="250px" />
        <AccountSettings />
      </CardV2>
      <AddExpenseDialog isOpen={isAddExpensesDialogOpen} onClose={() => setIsAddExpensesDialogOpen(false)} />
    </>
  );
}

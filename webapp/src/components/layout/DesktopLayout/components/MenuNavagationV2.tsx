import { useNavigate } from 'react-router-dom';

import { XpmLogoMain } from '../../../icons/XpmLogoMain/XpmLogoMain';
import { XpmButtonV2 } from '../../../XpmButtonV2/XpmButtonV2';
import { CardV2 } from '../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';
import { AccountSettings } from '../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { BasicDialog } from '../../BasicDialog/BasicDialog';
import { useState } from 'react';

export function MenuNavagationV2() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

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

        <XpmButtonV2 text="Add Expense" onClick={() => console.log('clicked add expense')} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Add Dashboard" onClick={() => console.log('clicked add dashboard')} />
        <XpmVerticalSpacer size="m" />
        <XpmHorizontalSeparator width="150px" />

        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Dashboard" onClick={() => navigate('expenses-dashboard')} />
        <XpmVerticalSpacer size="m" />
        <XpmButtonV2 text="Labels" onClick={() => navigate('expense-labels')} />
        <XpmButtonV2 text="toggle dialog" onClick={() => setIsOpen((prev) => !prev)} />
        <div style={{ flex: 1 }} />
        <XpmHorizontalSeparator width="250px" />
        <AccountSettings />
      </CardV2>
      <BasicDialog isOpen={isOpen} onBackdropClick={() => setIsOpen(false)}>
        hello world
      </BasicDialog>
    </>
  );
}

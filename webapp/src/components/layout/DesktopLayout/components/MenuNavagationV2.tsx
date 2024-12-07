import { useNavigate } from 'react-router-dom';

import { XpmLogoMain } from '../../../icons/XpmLogoMain/XpmLogoMain';
import { XpmButtonV2 } from '../../../XpmButtonV2/XpmButtonV2';
import { XpmCardV2 } from '../../XpmCardV2/XpmCardV2';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';
import { AccountSettings } from '../../../../Pages/Expenses/AddExpenses/AccountSettings';

export function MenuNavagationV2() {
  const navigate = useNavigate();

  return (
    <XpmCardV2 height="100%" width="340px">
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
      <div style={{ flex: 1 }} />
      <XpmHorizontalSeparator width="250px" />
      <AccountSettings />
    </XpmCardV2>
  );
}

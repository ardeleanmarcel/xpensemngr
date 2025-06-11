import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PAGE, PATH } from '../../../../../../constants/paths';
import { AccountSettings } from '../../../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { XpmLogoMain } from '../../../../../icons/XpmLogoMain/XpmLogoMain';
import { ButtonPill } from '../../../../../input/ButtonPill/ButtonPill';
import { CardV2 } from '../../../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../../../XpmVerticalSpacer/XpmVerticalSpacer';
import { AddExpenseDialog } from '../../AddExpenseDialog';
import { AddLabelDialog } from './AddLabelDialog';

export function MenuNavagationV2() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [isAddLabelDialogOpen, setIsAddLabelDialogOpen] = useState(false);

  const currentPage = getCurrentPage(pathname);
  const secondaryItemText = getAddItemButtonText(currentPage);

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

        <ButtonPill text="Add Expense" onClick={() => setIsAddExpenseDialogOpen(true)} />
        <XpmVerticalSpacer size="m" />
        {currentPage && (
          <>
            <ButtonPill text={secondaryItemText} onClick={handleSecondaryItemClick} />
            <XpmVerticalSpacer size="m" />
          </>
        )}
        <XpmHorizontalSeparator width="150px" />

        <XpmVerticalSpacer size="m" />
        <ButtonPill text="Dashboard" onClick={() => navigate(PATH.MainDashboard.Segment)} />
        <XpmVerticalSpacer size="m" />
        <ButtonPill text="Labels" onClick={() => navigate(PATH.LabelManagement.Segment)} />
        <div style={{ flex: 1 }} />
        <XpmHorizontalSeparator width="250px" />
        <AccountSettings />
      </CardV2>
      <AddExpenseDialog isOpen={isAddExpenseDialogOpen} onClose={() => setIsAddExpenseDialogOpen(false)} />
      <AddLabelDialog isOpen={isAddLabelDialogOpen} onClose={() => setIsAddLabelDialogOpen(false)} />
    </>
  );
}

function getCurrentPage(path: string): PAGE | undefined {
  if (path === PATH.LabelManagement.Segment) {
    return PAGE.Labels;
  }

  if (path === PATH.MainDashboard.Segment) {
    return PAGE.Dashboard;
  }
}

function getAddItemButtonText(page?: PAGE): string {
  if (page === PAGE.Labels) {
    return 'Add Label';
  }

  if (page === PAGE.Dashboard) {
    return 'Add Dashboard';
  }

  return '';
}

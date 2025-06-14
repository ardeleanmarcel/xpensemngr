import { useLocation, useNavigate } from 'react-router-dom';

import { PAGE, PATH } from '../../../../../../constants/paths';
import { Modal, useModal } from '../../../../../../contexts/modal/modal.context';
import { BagTags } from '../../../../../icons/BagTags/BagTags';
import { IconComponent } from '../../../../../icons/icon.types';
import { MoneyBills } from '../../../../../icons/MoneyBills/MoneyBills';
import { OpenEndWrench } from '../../../../../icons/OpenEndWrench/OpenEndWrench';
import { SquarePlus } from '../../../../../icons/SquarePlus/SquarePlus';
import { TableList } from '../../../../../icons/TableList/TableList';
import { XpmLogoMain } from '../../../../../icons/XpmLogoMain/XpmLogoMain';
import { ButtonPill } from '../../../../../input/ButtonPill/ButtonPill';
import { CardV2 } from '../../../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../../../XpmVerticalSpacer/XpmVerticalSpacer';
import { SettingsPopoverMenu } from './SettingsPopoverMenu';

export function MenuNavagationV2() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { show } = useModal();

  const currentPage = getCurrentPage(pathname);
  const secondaryItemText = getAddItemButtonText(currentPage);

  const handleSecondaryItemClick = () => {
    if (currentPage === PAGE.Labels) {
      show({ type: Modal.AddLabel });
    } else if (currentPage === PAGE.ExpenseManagement) {
      console.log('will add table');
    }
  };

  return (
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

      <ButtonPill text="Add Expense" Icon={MoneyBills} contentAlignment="left" onClick={() => show({ type: Modal.AddExpense })} />
      <XpmVerticalSpacer size="m" />
      {currentPage && (
        <>
          <ButtonPill
            text={secondaryItemText}
            Icon={getSecondaryActionIcon(currentPage)}
            contentAlignment="left"
            onClick={handleSecondaryItemClick}
            disabled={currentPage === PAGE.ExpenseManagement}
          />
          <XpmVerticalSpacer size="m" />
        </>
      )}
      <XpmHorizontalSeparator width="150px" />

      <XpmVerticalSpacer size="m" />
      <ButtonPill
        text="Dashboard"
        Icon={() => <div>X</div>}
        contentAlignment="left"
        disabled={currentPage === PAGE.FinancialDashboard}
        onClick={() => navigate(PATH.FinancialDashboard.Segment)}
        variant="secondary"
      />
      <XpmVerticalSpacer size="s" />
      <ButtonPill
        text="Expenses"
        Icon={TableList}
        contentAlignment="left"
        disabled={currentPage === PAGE.ExpenseManagement}
        onClick={() => navigate(PATH.ExpenseManagement.Segment)}
        variant="secondary"
      />
      <XpmVerticalSpacer size="s" />
      <ButtonPill
        text="Labels"
        Icon={BagTags}
        contentAlignment="left"
        disabled={currentPage === PAGE.Labels}
        onClick={() => navigate(PATH.LabelManagement.Segment)}
        variant="secondary"
      />
      <div style={{ flex: 1 }} />
      <XpmHorizontalSeparator width="250px" />
      <SettingsPopoverMenu />
    </CardV2>
  );
}

function getCurrentPage(path: string): PAGE | undefined {
  if (path === PATH.LabelManagement.Segment) {
    return PAGE.Labels;
  }

  if (path === PATH.ExpenseManagement.Segment) {
    return PAGE.ExpenseManagement;
  }

  if (path === PATH.FinancialDashboard.Segment) {
    return PAGE.FinancialDashboard;
  }
}

function getAddItemButtonText(page?: PAGE): string {
  if (page === PAGE.Labels) {
    return 'Add Label';
  }

  if (page === PAGE.ExpenseManagement) {
    return 'Configure Expense Tables';
  }

  if (page === PAGE.FinancialDashboard) {
    return 'Configure Dashboard';
  }

  return '';
}

function getSecondaryActionIcon(page?: PAGE): IconComponent {
  if (page === PAGE.Labels) {
    return SquarePlus;
  }

  if (page === PAGE.ExpenseManagement) {
    return OpenEndWrench;
  }

  if (page === PAGE.FinancialDashboard) {
    return OpenEndWrench;
  }

  return SquarePlus;
}

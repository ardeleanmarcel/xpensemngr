import './MenuNavigationV2.scss';

import cn from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import { PAGE, PATH } from '../../../../../../constants/paths';
import { Modal, useModal } from '../../../../../../contexts/modal/modal.context';
import {
  BagTags,
  ChartPie,
  IconComponent,
  MoneyBills,
  OpenEndWrench,
  SquarePlus,
  TableList,
  XpmLogoMain,
} from '../../../../../icons/icons';
import { ButtonPill } from '../../../../../input/ButtonPill/ButtonPill';
import { CardV2 } from '../../../../CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../../../XpmVerticalSpacer/XpmVerticalSpacer';
import { SettingsPopoverMenu } from './SettingsPopoverMenu';

export function MenuNavigationV2() {
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
      <NavMenuButton
        text="Dashboard"
        Icon={ChartPie}
        isCurrentPage={currentPage === PAGE.FinancialDashboard}
        onClick={() => navigate(PATH.FinancialDashboard.Segment)}
      />
      <XpmVerticalSpacer size="s" />
      <NavMenuButton
        text="Expenses"
        Icon={TableList}
        isCurrentPage={currentPage === PAGE.ExpenseManagement}
        onClick={() => navigate(PATH.ExpenseManagement.Segment)}
      />
      <XpmVerticalSpacer size="s" />
      <NavMenuButton
        text="Labels"
        Icon={BagTags}
        isCurrentPage={currentPage === PAGE.Labels}
        onClick={() => navigate(PATH.LabelManagement.Segment)}
      />
      <div style={{ flex: 1 }} />
      <XpmHorizontalSeparator width="250px" />
      <SettingsPopoverMenu />
    </CardV2>
  );
}

function NavMenuButton({
  text,
  Icon,
  onClick,
  isCurrentPage = false,
}: {
  text: string;
  Icon: IconComponent;
  onClick: () => void;
  isCurrentPage: boolean;
}) {
  return (
    <div className={cn({ 'MenuNavigationV2__NavMenuButton--isCurrentPage': isCurrentPage })}>
      <ButtonPill
        text={text}
        Icon={Icon}
        contentAlignment="left"
        onClick={onClick}
        // disabled={isCurrentPage}
        isActive={isCurrentPage}
        variant="secondary"
      />
    </div>
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

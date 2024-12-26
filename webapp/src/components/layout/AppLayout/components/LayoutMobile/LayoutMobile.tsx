import './LayoutMobile.scss';

import { FunctionComponent, PropsWithChildren, useState } from 'react';

import { AccountSettings } from '../../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { ThreeLines } from '../../../../icons/ThreeLines/ThreeLines';
import { ButtonPill } from '../../../../input/ButtonPill/ButtonPill';
import { AddExpenseDialog } from '../AddExpenseDialog';

// TODO (Valle) -> create a ButtonIcon component that takes an icon as a prop
export const LayoutMobile: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);

  return (
    <>
      <div className="LayoutMobile">
        <div className="LayoutMobile--top-bar">
          <button
            onClick={() => {
              console.log('menu');
            }}
          >
            <ThreeLines />
          </button>
          <ButtonPill
            text="Add Expense" // TODO -> change name and functionality based on current page
            onClick={() => {
              setIsAddExpenseDialogOpen(true);
            }}
          />
          <AccountSettings />
        </div>
        <div className="LayoutMobile--content">{children}</div>
      </div>
      <AddExpenseDialog isOpen={isAddExpenseDialogOpen} onClose={() => setIsAddExpenseDialogOpen(false)} />
    </>
  );
};

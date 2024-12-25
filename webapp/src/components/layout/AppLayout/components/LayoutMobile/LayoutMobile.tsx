import './LayoutMobile.scss';

import React from 'react';

import { AccountSettings } from '../../../../../Pages/Expenses/AddExpenses/AccountSettings';
import { ThreeLines } from '../../../../icons/ThreeLines/ThreeLines';
import { ButtonPill } from '../../../../input/ButtonPill/ButtonPill';

// TODO (Valle) -> create an ButtonIcon component that takes an icon as a prop
export const LayoutMobile: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
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
            console.log('add expense');
          }}
        />
        <AccountSettings />
      </div>
      <div className="LayoutMobile--content">{children}</div>
    </div>
  );
};

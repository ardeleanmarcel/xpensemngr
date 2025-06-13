import './LayoutMobile.scss';

import { FunctionComponent, PropsWithChildren } from 'react';

import { Modal, useModal } from '../../../../../contexts/modal/modal.context';
import { ThreeLines } from '../../../../icons/ThreeLines/ThreeLines';
import { ButtonPill } from '../../../../input/ButtonPill/ButtonPill';
import { SettingsPopoverMenu } from '../DesktopLayout/components/SettingsPopoverMenu';

// TODO (Valle) -> create a ButtonIcon component that takes an icon as a prop
export const LayoutMobile: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { show } = useModal();

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
            show({ type: Modal.AddExpense });
          }}
        />
        <SettingsPopoverMenu />
      </div>
      <div className="LayoutMobile--content">{children}</div>
    </div>
  );
};

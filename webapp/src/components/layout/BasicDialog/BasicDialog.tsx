import React from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

import { CardV2 } from '../CardV2/CardV2';

import './BasicDialog.scss';

interface BasicDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onBackdropClick?: React.MouseEventHandler<HTMLDialogElement>;
  width?: string;
  height?: string;
}

export const BasicDialog: React.FunctionComponent<BasicDialogProps> = ({ isOpen, children, onBackdropClick, width, height }) => {
  const dialog = (
    <dialog className={cn('BasicDialog', { 'BasicDialog--open': isOpen })} onClick={onBackdropClick}>
      <div onClick={(e) => e.stopPropagation()}>
        <CardV2 width={width} height={height}>
          {children}
        </CardV2>
      </div>
    </dialog>
  );

  const container = document.querySelector('body');

  if (!container) return null;

  return createPortal(dialog, container);
};

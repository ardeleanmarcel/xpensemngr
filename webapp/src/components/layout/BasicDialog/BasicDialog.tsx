import './BasicDialog.scss';

import cn from 'classnames';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { CardV2 } from '../CardV2/CardV2';

interface BasicDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onBackdropClick?: React.MouseEventHandler<HTMLDialogElement>;
  width?: string;
  height?: string;
  onAfterOpen?: () => void;
  showLoading?: boolean;
}

export const BasicDialog: React.FunctionComponent<BasicDialogProps> = ({
  isOpen,
  children,
  onBackdropClick,
  width,
  height,
  onAfterOpen,
  showLoading,
}) => {
  useEffect(() => {
    if (isOpen && onAfterOpen) onAfterOpen();
  }, [isOpen]);

  const dialog = (
    <dialog className={cn('BasicDialog', { 'BasicDialog--open': isOpen })} onClick={onBackdropClick}>
      <div onClick={(e) => e.stopPropagation()}>
        <CardV2 width={width} height={height} showLoading={showLoading}>
          {children}
        </CardV2>
      </div>
    </dialog>
  );

  const container = document.querySelector('body');

  if (!container) return null;

  return createPortal(dialog, container);
};

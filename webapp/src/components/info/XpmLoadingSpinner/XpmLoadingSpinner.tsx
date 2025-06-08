import './XpmLoadingSpinner.scss';

import cn from 'classnames';
import { createPortal } from 'react-dom';

interface XpmLoadingSpinnerProps {
  isVisible: boolean;
  fullscreen?: boolean;
}

export function XpmLoadingSpinner({ fullscreen, isVisible }: React.PropsWithChildren<XpmLoadingSpinnerProps>) {
  const rotatingElements = (
    <div className="XpmLoadingSpinner--rotatingWrapper">
      <span>$</span>
      <span>€</span>
      <span>£</span>
      <span>¥</span>
      <span>₱</span>
    </div>
  );

  const overlay = (
    <div
      className={cn('XpmLoadingSpinner', {
        'XpmLoadingSpinner--visible': isVisible,
      })}
    >
      {isVisible && rotatingElements}
    </div>
  );

  if (fullscreen) {
    return createPortal(overlay, document.body);
  } else {
    return overlay;
  }
}

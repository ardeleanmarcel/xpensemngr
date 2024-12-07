import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import cn from 'classnames';

import './XpmLoadingSpinner.scss';

interface XpmLoadingSpinnerProps {
  isVisible: boolean;
  fullscreen?: boolean;
}

export function XpmLoadingSpinner({
  fullscreen,
  isVisible,
}: React.PropsWithChildren<XpmLoadingSpinnerProps>) {
  useEffect(() => {
    if (!fullscreen) {
      return;
    }
    const div = document.createElement('div');
    document.body.prepend(div);

    return () => {
      document.body.removeChild(div);
    };
  }, [fullscreen]);

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

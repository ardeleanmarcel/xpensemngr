import './XpmLoadingSpinner.scss';

import cn from 'classnames';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface XpmLoadingSpinnerProps {
  isVisible: boolean;
  fullscreen?: boolean;
}

export function XpmLoadingSpinner({ fullscreen, isVisible }: React.PropsWithChildren<XpmLoadingSpinnerProps>) {
  useEffect(() => {
    if (!fullscreen) {
      return;
    }
    // TODO (Valle) -> this div is not really used... check the fullscreen mount
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

import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import './XpmLoadingSpinner.scss';

export function XpmLoadingSpinner() {
  useEffect(() => {
    const div = document.createElement('div');
    document.body.prepend(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const result = (
    <div className="XpmLoadingSpinner">
      <div className="XpmLoadingSpinner--rotatingWrapper">
        <span>$</span>
        <span>€</span>
        <span>£</span>
        <span>¥</span>
        <span>₱</span>
      </div>
    </div>
  );

  return createPortal(result, document.body);
}

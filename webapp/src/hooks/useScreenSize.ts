import { useCallback, useEffect, useMemo, useState } from 'react';

import { BREAKPOINT, SCREEN_SIZE } from '../constants/screenSize';
import { useDebounced } from './useDebounced';

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<SCREEN_SIZE>(getScreenSize());

  const debounced = useDebounced(500);

  const handleResize = useCallback(() => {
    debounced.run(() => {
      const newSize = getScreenSize();

      setScreenSize(newSize);
    });
  }, [debounced]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  return useMemo(() => ({ screenSize }), [screenSize]);
}

function getScreenSize(): SCREEN_SIZE {
  if (window.innerWidth <= BREAKPOINT.PhoneToTablet) {
    return SCREEN_SIZE.Phone;
  } else if (window.innerWidth <= BREAKPOINT.TabletToDesktop) {
    return SCREEN_SIZE.Tablet;
  } else {
    return SCREEN_SIZE.Desktop;
  }
}

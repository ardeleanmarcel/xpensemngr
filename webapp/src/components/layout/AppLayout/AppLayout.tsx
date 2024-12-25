import React, { useCallback, useEffect, useState } from 'react';

import { useDebounced } from '../../../hooks/useDebounced';
import { DesktopLayout } from './components/DesktopLayout/DesktopLayout';
import { LayoutMobile } from './components/LayoutMobile/LayoutMobile';

const MAX_MOBILE_WIDTH = 800;

export const AppLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MAX_MOBILE_WIDTH);
  const debounced = useDebounced(500);

  const handleResize = useCallback(() => {
    debounced.run(() => {
      const isMob = window.innerWidth < MAX_MOBILE_WIDTH;

      setIsMobile(isMob);
    });
  }, [debounced]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  if (isMobile) return <LayoutMobile>{children}</LayoutMobile>;

  return <DesktopLayout>{children}</DesktopLayout>;
};

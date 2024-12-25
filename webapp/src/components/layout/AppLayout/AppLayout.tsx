import React from 'react';

import { DesktopLayout } from './components/DesktopLayout/DesktopLayout';

export const AppLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  if (window.innerWidth < 800) return <>{children}</>;

  return <DesktopLayout>{children}</DesktopLayout>;
};

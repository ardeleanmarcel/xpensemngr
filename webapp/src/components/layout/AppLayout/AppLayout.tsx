import React from 'react';

import { SCREEN_SIZE } from '../../../constants/screenSize';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { DesktopLayout } from './components/DesktopLayout/DesktopLayout';
import { LayoutMobile } from './components/LayoutMobile/LayoutMobile';

export const AppLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const { screenSize } = useScreenSize();

  if (screenSize === SCREEN_SIZE.Phone) return <LayoutMobile>{children}</LayoutMobile>;

  return <DesktopLayout>{children}</DesktopLayout>;
};

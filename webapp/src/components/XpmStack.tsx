import { Stack } from '@mui/material';
import { ReactNode } from 'react';

type XpmStackProps = {
  children: ReactNode;
};

export const XpmStack = ({ children }: XpmStackProps) => {
  return <Stack>{children}</Stack>;
};

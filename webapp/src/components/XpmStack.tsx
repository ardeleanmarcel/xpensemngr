import { ReactNode } from 'react';
import { Stack } from '@mui/material';

type XpmStackProps = {
  children: ReactNode;
};

export const XpmStack = ({ children }: XpmStackProps) => {
  return <Stack>{children}</Stack>;
};

import { ReactNode } from 'react';
import { Card, SxProps } from '@mui/material';

type XpmCardProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const XpmCard = ({ children, sx }: XpmCardProps) => {
  return <Card sx={sx}>{children}</Card>;
};

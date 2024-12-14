import { Card, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type XpmCardProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const XpmCard = ({ children, sx }: XpmCardProps) => {
  return <Card sx={sx}>{children}</Card>;
};

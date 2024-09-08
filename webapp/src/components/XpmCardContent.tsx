import { CardContent, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type XpmCardContentProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const XpmCardContent = ({ children, sx }: XpmCardContentProps) => {
  return <CardContent sx={sx}>{children}</CardContent>;
};

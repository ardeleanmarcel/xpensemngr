import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type XpmBoxProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const XpmBox = ({ children, sx }: XpmBoxProps) => {
  return <Box sx={sx}>{children}</Box>;
};

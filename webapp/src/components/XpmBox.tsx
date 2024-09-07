import { ReactNode } from 'react';
import { Box, SxProps } from '@mui/material';

type XpmBoxProps = {
  children: ReactNode;
  sx?: SxProps;
};

export const XpmBox = ({ children, sx }: XpmBoxProps) => {
  return <Box sx={sx}>{children}</Box>;
};

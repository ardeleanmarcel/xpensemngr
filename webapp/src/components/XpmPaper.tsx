import { Paper, SxProps } from '@mui/material';
import { ReactNode } from 'react';

type XpmPaperProps = {
  children: ReactNode;
  sx: SxProps;
};

export const XpmPaper = ({ children, sx }: XpmPaperProps) => {
  return <Paper sx={sx}>{children}</Paper>;
};

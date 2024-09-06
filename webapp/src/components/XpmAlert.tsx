import { Alert, AlertColor } from '@mui/material';

type XpmAlertProps = {
  severity: AlertColor;
  message: string;
};

export const XpmAlert = ({ severity, message }: XpmAlertProps) => {
  return <Alert severity={severity}>{message}</Alert>;
};

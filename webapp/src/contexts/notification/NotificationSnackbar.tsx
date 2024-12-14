import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { SnackbarType } from './notification.context';

type NotificationSnackbarProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type: SnackbarType;
};

export function NotificationSnackbar({
  isOpen,
  message,
  onClose,
  type,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

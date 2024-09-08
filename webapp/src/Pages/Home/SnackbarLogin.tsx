// import * as React from 'react';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const SUCCESS_MSG = 'You have successfully logged in.';
export const FAIL_MSG = 'Fail! Make sure your credential are valid.';

export function SnackbarLogin({ isOpen, message, onClose }) {
  return (
    <div>
      {/* <Button onClick={handleOpenSnackbar}>Open Snackbar</Button> */}
      <Snackbar
        open={isOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onClose}
      >
        <Alert
          onClose={onClose}
          severity={message === SUCCESS_MSG ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

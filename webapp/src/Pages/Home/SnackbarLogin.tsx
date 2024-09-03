// import * as React from 'react';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function SnackbarLogin({
  openSnackbar,
  //   handleOpenSnackbar,
  handleCloseSnackbar,
}) {
  return (
    <div>
      {/* <Button onClick={handleOpenSnackbar}>Open Snackbar</Button> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          You successfully logged in!
        </Alert>
      </Snackbar>
    </div>
  );
}

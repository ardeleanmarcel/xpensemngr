import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center',
  p: 4,
};

export function ModalReceivedEmail({ handleCloseModal, openModal }) {
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Password reset request accepted.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            For further instructions please check your email!
          </Typography>
          <Button
            variant="outlined"
            sx={{
              boxShadow: 3,
              marginTop: '40px',
              marginBottom: '40px',
            }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

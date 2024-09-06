import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { XpmButton } from '../../components/XpmButton';
import { XpmTypography } from '../../components/XpmTypography';

const TITLE = 'Password reset request accepted.';
const INFO = 'For further instructions please check your email!';
const CLOSE_BUTTON = 'Close';

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
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <XpmTypography
            id="modal-title"
            variant="h6"
            component="h2"
            text={TITLE}
          />

          <XpmTypography
            id="modal-description"
            sx={{ mt: 2 }}
            text={INFO}
            variant="body1"
          />
          <XpmButton
            variant="outlined"
            sx={{
              boxShadow: 3,
              marginTop: '40px',
              marginBottom: '40px',
            }}
            onClick={handleCloseModal}
            buttonName={CLOSE_BUTTON}
          />
        </Box>
      </Modal>
    </div>
  );
}

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { XpmButton } from '../../components/XpmButton';

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

export function ModalRegisterMessage({
  handleCloseModal,
  openModal,
  title,
  text,
  modalBtnText,
}) {
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {text}
        </Typography>
        <XpmButton
          variant="outlined"
          sx={{
            boxShadow: 3,
            marginTop: '40px',
            marginBottom: '40px',
          }}
          onClick={handleCloseModal}
          buttonName={modalBtnText}
        />
      </Box>
    </Modal>
  );
}

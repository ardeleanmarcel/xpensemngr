import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { ModalReceivedEmail } from './ModalReceivedEmail';

export function EmailForNewPassword() {
  const [userInput, setUserInput] = useState({ email: '' });
  const [isActive, setIsActive] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.includes('@')) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={{ width: '380px' }}>
      <CardContent sx={{ marginTop: '30vh' }}>
        <Stack>
          <TextField
            label="your email"
            name="email"
            value={userInput.email}
            onChange={(e) => handleInput(e)}
          ></TextField>
          <Typography variant="caption">
            Email contains "@" character
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              boxShadow: 3,
              marginTop: '40px',
              marginBottom: '40px',
            }}
            disabled={isActive}
            onClick={handleOpenModal}
          >
            Submit
          </Button>
          {openModal && (
            <ModalReceivedEmail
              handleCloseModal={handleCloseModal}
              openModal={openModal}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

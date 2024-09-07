import { useState } from 'react';

import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { XpmTypography } from '../../components/XpmTypography';
import { ModalReceivedEmail } from './ModalReceivedEmail';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';
import { XpmStack } from '../../components/XpmStack';

const INFO_TEXT = "Email contains '@' character";

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
    <XpmCard sx={{ width: '380px' }}>
      <XpmCardContent sx={{ marginTop: '30vh' }}>
        <XpmStack>
          <XpmTextField
            label="your email"
            name="email"
            value={userInput.email}
            onChange={(e) => handleInput(e)}
          />
          <XpmTypography variant="caption" text={INFO_TEXT} />
          <XpmButton
            variant="contained"
            color="secondary"
            sx={{
              boxShadow: 3,
              marginTop: '40px',
              marginBottom: '40px',
            }}
            disabled={isActive}
            onClick={handleOpenModal}
            buttonName="Submit"
          />
          {openModal && (
            <ModalReceivedEmail
              handleCloseModal={handleCloseModal}
              openModal={openModal}
            />
          )}
        </XpmStack>
      </XpmCardContent>
    </XpmCard>
  );
}

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '../../api/apiClient';
import { ColorModeContext } from '../../App';
import { XpmButton } from '../../components/XpmButton';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';
import { XpmTextField } from '../../components/XpmTextField';
import { XpmTypography } from '../../components/XpmTypography';
import { ModalRegisterMessage } from './ModalRegisterMessage';

const inputsStyle = {
  marginBottom: '21px',
};

const cardContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 5,
  padding: '16px',
  width: '380px',
};

const requiredInfoStyle = {
  marginBottom: '15px',
  fontSize: '15px',
  color: 'grey',
};

const LOGIN_BUTTON = 'Login';
const REGISTER_BUTTON = 'Register';
const REQUIRED_TEXT = '* indicates a required field';
const REGISTER_ACCOUNT = 'Register account';
const INFO_TEXT = 'You already have an account? Login below';

export default function Register() {
  const navigate = useNavigate();
  const { mode } = useContext(ColorModeContext);

  const [userInput, setUserInput] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoToSignIn = () => {
    navigate('/');
  };

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    registerSuccess && navigate('/');
  };

  const handleRegister = async () => {
    try {
      const res = await client.users.create.mutate({
        username: userInput.username,
        password: userInput.password,
        email: userInput.email,
      });
      console.log('res', res);

      setOpenModal(true);
      setTitle('you have successfuly been registered!');
      setText('please, check your email for validation!');
      handleOpenModal();

      setRegisterSuccess(true);
    } catch (error) {
      console.log('error: ', error);

      setOpenModal(true);
      setTitle('there has been an error!');
      setText('please, make sure you entered the corect data');
      handleOpenModal();

      setRegisterSuccess(false);
    }
  };

  return (
    <XpmCard sx={cardContainerStyle}>
      <XpmCardContent
        sx={{
          textAlign: 'left',
        }}
      >
        <XpmTypography
          variant="h5"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '25px 0px 25px 0px',
            fontWeight: 'fontWeightBold',
          }}
          text={REGISTER_ACCOUNT}
        />
        <XpmTypography sx={{ requiredInfoStyle }} text={REQUIRED_TEXT} />
        <XpmTextField
          required
          label="First Name"
          name="firstName"
          color="inputsColor"
          value={userInput.firstName}
          onChange={(e) => handleInput(e)}
          aria-invalid="false"
          sx={inputsStyle}
          fullWidth
        />
        <XpmTextField
          required
          label="Last Name"
          color="inputsColor"
          value={userInput.lastName}
          name="lastName"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <XpmTextField
          required
          label="Username"
          color="inputsColor"
          value={userInput.username}
          name="username"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <XpmTextField
          required
          label="Email"
          color="inputsColor"
          value={userInput.email}
          name="email"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <XpmTextField
          required
          label="Password"
          type="password"
          value={userInput.password}
          name="password"
          color="inputsColor"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <XpmTextField
          required
          label="Confirm Password"
          type="password"
          color="inputsColor"
          value={userInput.confirmPassword}
          name="confirmPassword"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <XpmButton
          variant="contained"
          color="secondary"
          sx={{
            boxShadow: 3,
            marginTop: '40px',
            marginBottom: '40px',
          }}
          fullWidth
          onClick={handleRegister}
          buttonName={REGISTER_BUTTON}
        />
        <XpmTypography
          sx={{ marginBottom: '20px', textAlign: 'center' }}
          text={INFO_TEXT}
        />
        <XpmButton
          variant="outlined"
          color="secondary"
          sx={{
            border: '1px solid',
            borderColor: mode === 'light' ? 'black' : 'white',
            boxShadow: 3,
            marginBottom: '20px',
          }}
          fullWidth
          onClick={handleGoToSignIn}
          buttonName={LOGIN_BUTTON}
        />

        <ModalRegisterMessage
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          title={title}
          text={text}
          modalBtnText={registerSuccess ? 'Go to Login Page' : 'Close'}
        />
      </XpmCardContent>
    </XpmCard>
  );
}

import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import { client } from '../../api/apiClient';
import { ColorModeContext } from '../../App';

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

  const handleRegister = async () => {
    const res = await client.users.create.mutate({
      username: userInput.username,
      password: userInput.password,
      email: userInput.email,
    });

    console.log('res', res);
  };

  return (
    <Card sx={cardContainerStyle}>
      <CardContent
        sx={{
          textAlign: 'left',
        }}
      >
        <Typography
          variant="h5"
          fontWeight="fontWeightBold"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '25px 0px 25px 0px',
          }}
        >
          Register account
        </Typography>
        <Typography sx={requiredInfoStyle}>
          * indicates a required field
        </Typography>
        <Stack>
          <TextField
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
        </Stack>
        <Stack>
          <TextField
            required
            label="Last Name"
            color="inputsColor"
            value={userInput.lastName}
            name="lastName"
            onChange={(e) => handleInput(e)}
            sx={inputsStyle}
            fullWidth
          />
        </Stack>
        <Stack>
          <TextField
            required
            label="Username"
            color="inputsColor"
            value={userInput.username}
            name="username"
            onChange={(e) => handleInput(e)}
            sx={inputsStyle}
            fullWidth
          />
        </Stack>
        <TextField
          required
          label="Email"
          color="inputsColor"
          value={userInput.email}
          name="email"
          onChange={(e) => handleInput(e)}
          sx={inputsStyle}
          fullWidth
        />
        <Stack>
          <TextField
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
        </Stack>
        <Stack>
          <TextField
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
        </Stack>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            boxShadow: 3,
            marginTop: '40px',
            marginBottom: '40px',
          }}
          fullWidth
          onClick={handleRegister}
        >
          Register
        </Button>
        <Typography sx={{ marginBottom: '20px', textAlign: 'center' }}>
          You already have an account? Login below
        </Typography>
        <Button
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
        >
          Login
        </Button>
      </CardContent>
    </Card>
  );
}

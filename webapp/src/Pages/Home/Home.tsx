import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { useFormikContext } from 'formik';

import { Card, CardContent, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { withFormik } from '../../withFormik';
import { ColorModeContext } from '../../App';
import { client } from '../../api/apiClient';
import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { ForgotPassword } from './ForgotPassword';

const initialValues = {
  username: '',
  password: '',
};

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'grid',
    gap: '50px',
  },
  title: {
    color: theme.palette.text.primary,
    marginTop: '40px !important',
    //TODO -> remove '!important'
  },
  actionText: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.text.primary,
  },
}));

function Home() {
  const classes = useStyles();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('authToken');
  if (isLoggedIn) {
    navigate('/add-expenses');
  }

  const { handleChange, values, handleSubmit, isSubmitting } =
    useFormikContext<typeof initialValues>();

  const { mode } = useContext(ColorModeContext);

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Card>
      <CardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className={classes.container}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              className={classes.title}
            >
              Expense Manager
            </Typography>
            <XpmTextField
              id="username"
              variant="outlined"
              label="Username"
              type="text"
              name="username"
              color="inputsColor"
              onChange={handleChange}
              value={values.username}
              disabled={isSubmitting}
            />
            <XpmTextField
              id="password"
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              color="inputsColor"
              onChange={handleChange}
              value={values.password}
              disabled={isSubmitting}
            />
            <ForgotPassword />
            <XpmButton
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                boxShadow: 3,
              }}
              fullWidth
              disabled={isSubmitting}
              buttonName="Login"
            />
            <div className={classes.actionText}>
              You do not have an account? Register below
            </div>
            <XpmButton
              variant="outlined"
              color="secondary"
              sx={{
                border: '1px solid',
                borderColor: mode === 'light' ? 'black' : 'white',
                boxShadow: 3,
              }}
              fullWidth
              onClick={handleRegister}
              disabled={isSubmitting}
              buttonName="Register"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    const response = await client.auth.signIn.mutate({
      username: values.username,
      password: values.password,
    });
    localStorage.setItem('authToken', response.token);
    setSubmitting(false);
  } catch (error) {
    setSubmitting(false);
  }
};

const LoginWithFormik = withFormik(initialValues, handleSubmit, Home);

export default LoginWithFormik;

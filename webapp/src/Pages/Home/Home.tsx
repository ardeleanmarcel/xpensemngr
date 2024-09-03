import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useFormikContext } from 'formik';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { withFormik } from '../../withFormik';
import { ColorModeContext } from '../../App';
import { client } from '../../api/apiClient';
import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { XpmTypography } from '../../components/XpmTypography';
import { ForgotPassword } from './ForgotPassword';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';
import { SnackbarLogin } from './SnackbarLogin';

const initialValues = {
  username: '',
  password: '',
};

const TITLE = 'Expense Manager';

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

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

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
    <XpmCard>
      <XpmCardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className={classes.container}>
            <XpmTypography
              variant="h4"
              component="h2"
              align="center"
              className={classes.title}
              text={TITLE}
            />
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

        <SnackbarLogin
          openSnackbar={openSnackbar}
          handleOpenSnackbar={handleOpenSnackbar}
          handleCloseSnackbar={handleCloseSnackbar}
        />
      </XpmCardContent>
    </XpmCard>
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
    handleOpenSnackbar();
  } catch (error) {
    setSubmitting(false);
  }
};

const LoginWithFormik = withFormik(initialValues, handleSubmit, Home);

export default LoginWithFormik;

import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useNotification } from '../../contexts/notification/notification.context';
import { withFormik } from '../../withFormik';
import { ColorModeContext } from '../../App';
import { client } from '../../api/apiClient';
import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { XpmTypography } from '../../components/XpmTypography';
import { ForgotPassword } from './ForgotPassword';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';

const initialValues = {
  username: '',
  password: '',
  message: '',
};

const TITLE = 'Expense Manager';

export const SUCCESS_MSG = 'You have successfully logged in.';
export const FAIL_MSG = 'Fail! Make sure your credential are valid.';

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

  const { displaySnackbar } = useNotification();

  const { handleChange, values, handleSubmit, isSubmitting, setValues } =
    useFormikContext<typeof initialValues>();

  useEffect(() => {
    if (!values.message) return;

    setValues((prev) => ({
      ...prev,
      message: '',
    }));

    if (values.message === SUCCESS_MSG) {
      displaySnackbar({ message: SUCCESS_MSG, type: 'success' });
      navigate('/add-expenses');
      return;
    }

    if (values.message === FAIL_MSG) {
      displaySnackbar({ message: FAIL_MSG, type: 'error' });
    }
  }, [values.message]);

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
        <button
          onClick={() =>
            displaySnackbar({ message: 'wow, it works', type: 'error' })
          }
        >
          test
        </button>
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
      </XpmCardContent>
    </XpmCard>
  );
}

const handleSubmit = async (values, { setSubmitting, setValues }) => {
  try {
    const response = await client.auth.signIn.mutate({
      username: values.username,
      password: values.password,
    });
    localStorage.setItem('authToken', response.token);
    setValues({ ...values, message: SUCCESS_MSG });
    setSubmitting(false);
  } catch (error) {
    setSubmitting(false);
    setValues({
      ...values,
      message: FAIL_MSG,
    });
  }
};

const LoginWithFormik = withFormik(initialValues, handleSubmit, Home);

export default LoginWithFormik;

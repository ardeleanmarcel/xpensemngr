import { useNavigate } from 'react-router-dom';
import { FormEvent, useContext, useState } from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useNotification } from '../../contexts/notification/notification.context';
import { ColorModeContext } from '../../App';
import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { XpmTypography } from '../../components/XpmTypography';
import { ForgotPassword } from './ForgotPassword';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';
import { useUser } from '../../contexts/user/user.context';

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

  const { mode } = useContext(ColorModeContext);
  const { signIn } = useUser();

  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('calling handlesubmit');
    setIsSubmitting(true);
    const success = await signIn(form);

    console.log('success', success);
    if (success) {
      displaySnackbar({ message: SUCCESS_MSG, type: 'success' });
      navigate('/add-expenses');
    } else {
      displaySnackbar({ message: FAIL_MSG, type: 'error' });
    }

    setIsSubmitting(false);
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
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
              value={form.username}
              disabled={isSubmitting}
            />
            <XpmTextField
              id="password"
              variant="outlined"
              label="Password"
              type="password"
              name="password"
              color="inputsColor"
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              value={form.password}
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

export default Home;

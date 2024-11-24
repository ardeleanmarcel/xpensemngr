import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useNotification } from '../../contexts/notification/notification.context';
import { ColorModeContext } from '../../App';
import { XpmButton } from '../../components/XpmButton';
import { XpmTextField } from '../../components/XpmTextField';
import { ForgotPassword } from './ForgotPassword';
import { useUser } from '../../contexts/user/user.context';
import { XpmButtonV2 } from '../../components/XpmButtonV2/XpmButtonV2';
import { XpmInputText } from '../../components/XpmInputText/XpmInputText';
import { XpmText } from '../../components/XpmText/XpmText';
import { XpmLogoMain } from '../../components/icons/XpmLogoMain/XpmLogoMain';
import { XpmHorizontalSeparator } from '../../components/layout/XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmCardV2 } from '../../components/layout/XpmCard/XpmCard';

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

  // TODO -> fix type for event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signIn(form);

    if (success) {
      displaySnackbar({ message: SUCCESS_MSG, type: 'success' });
      navigate('/add-expenses');
    } else {
      displaySnackbar({ message: FAIL_MSG, type: 'error' });
    }

    setIsSubmitting(false);
  };

  return (
    <XpmCardV2 width="700px">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <XpmLogoMain />
        <XpmText content="Xpensemngr" size="m" />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <XpmText content="Login" size="m" />
        <XpmHorizontalSeparator width="32px" />
      </div>
      <XpmInputText
        name="Username"
        value={form.username}
        onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
        width="460px"
      />
      <XpmTextField
        id="password"
        variant="outlined"
        label="Password"
        type="password"
        name="password"
        color="inputsColor"
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        value={form.password}
        disabled={isSubmitting}
      />
      <ForgotPassword />
      <XpmButtonV2 text="Login" onClick={handleSubmit} />
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
    </XpmCardV2>
  );
}

export default Home;

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useNotification } from '../../contexts/notification/notification.context';
import { useUser } from '../../contexts/user/user.context';
import { XpmButtonV2 } from '../../components/XpmButtonV2/XpmButtonV2';
import { XpmInputText } from '../../components/XpmInputText/XpmInputText';
import { XpmText } from '../../components/XpmText/XpmText';
import { XpmLogoMain } from '../../components/icons/XpmLogoMain/XpmLogoMain';
import { XpmHorizontalSeparator } from '../../components/layout/XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmCardV2 } from '../../components/layout/XpmCardV2/XpmCardV2';
import { XpmVerticalSpacer } from '../../components/layout/XpmVerticalSpacer/XpmVerticalSpacer';
import { XpmLinkButton } from '../../components/input/XpmLinkButton/XpmLinkButton';

export const SUCCESS_MSG = 'You have successfully logged in.';
export const FAIL_MSG = 'Fail! Make sure your credential are valid.';

function Home() {
  const navigate = useNavigate();
  const { displaySnackbar } = useNotification();

  const { signIn } = useUser();

  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
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
    <div
      style={{
        height: '100%',
        position: 'relative',
        backgroundImage: `url('/images/piggyV2.jpg')`, // Path relative to the public folder

        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '50%',
          top: '50%',
          transform: 'translate(5%, -50%)',
        }}
      >
        <XpmCardV2 width="700px" showLoading={isSubmitting}>
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
          <XpmVerticalSpacer size="m" />
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
          <XpmVerticalSpacer size="xxxl" />
          <XpmVerticalSpacer size="l" />
          <XpmInputText
            name="Username"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            width="460px"
          />
          <XpmVerticalSpacer size="xxxl" />
          <XpmVerticalSpacer size="l" />
          <XpmInputText
            name="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            width="460px"
          />
          <XpmVerticalSpacer size="xs" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '450px' }}>
            <XpmLinkButton text="Forgot Password" to="/forgot-password" size="xs" showUnderline={false} />
          </div>
          <XpmVerticalSpacer size="l" />
          <XpmButtonV2 text="Login" onClick={handleSubmit} />
          <XpmVerticalSpacer size="xxl" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '480px',
            }}
          >
            <XpmText content="Don't have an account?" />
            <XpmLinkButton text="Register Here" to="/register" />
          </div>
          <XpmVerticalSpacer size="xxl" />
          <XpmLinkButton text="Continue without an account" onClick={() => console.log('Continue without an account')} />
          <XpmVerticalSpacer size="xs" />
        </XpmCardV2>
      </div>
    </div>
  );
}

export default Home;

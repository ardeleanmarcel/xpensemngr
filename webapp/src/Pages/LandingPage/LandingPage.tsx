import './LandingPage.scss';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { XpmLogoMain } from '../../components/icons/XpmLogoMain/XpmLogoMain';
import { ButtonLink } from '../../components/input/ButtonLink/ButtonLink';
import { ButtonPill } from '../../components/input/ButtonPill/ButtonPill';
import { InputText } from '../../components/input/InputText/InputText';
import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { XpmHorizontalSeparator } from '../../components/layout/XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../components/layout/XpmVerticalSpacer/XpmVerticalSpacer';
import { XpmText } from '../../components/XpmText/XpmText';
import { PATH } from '../../constants/paths';
import { SCREEN_SIZE } from '../../constants/screenSize';
import { SnackbarType, useNotification } from '../../contexts/notification/notification.context';
import { useUser } from '../../contexts/user/user.context';
import { useScreenSize } from '../../hooks/useScreenSize';

export const SUCCESS_MSG = 'You have successfully logged in.';
export const FAIL_MSG = 'Fail! Make sure your credential are valid.';

function Home() {
  const navigate = useNavigate();
  const { displaySnackbar } = useNotification();
  const { screenSize } = useScreenSize();

  const { signIn } = useUser();

  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signIn(form);

    if (success) {
      displaySnackbar({ message: SUCCESS_MSG, type: SnackbarType.Success });
      navigate(PATH.ExpenseDashboard.Segment);
    } else {
      displaySnackbar({ message: FAIL_MSG, type: SnackbarType.Error });
    }

    setIsSubmitting(false);
  };

  const cardWidth = screenSize === SCREEN_SIZE.Phone ? '100%' : '700px';

  return (
    <div className="LandingPage--background">
      <div className="LandingPage--card-container">
        <CardV2 width={cardWidth} showLoading={isSubmitting}>
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
          <InputText
            name="Username"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            width="460px"
            maxWidth="100%"
          />
          <XpmVerticalSpacer size="xxxl" />
          <XpmVerticalSpacer size="l" />
          <InputText
            name="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            width="460px"
            maxWidth="100%"
          />
          <XpmVerticalSpacer size="xs" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '450px' }}>
            <ButtonLink text="Forgot Password" to={PATH.ResetPassword.Segment} size="xs" showUnderline={false} />
          </div>
          <XpmVerticalSpacer size="l" />
          <ButtonPill text="Login" onClick={handleSubmit} />
          <XpmVerticalSpacer size="xxl" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '480px',
            }}
          >
            <XpmText content="Don't have an account?" />
            <ButtonLink text="Register Here" to="/register" />
          </div>
          <XpmVerticalSpacer size="xxl" />
          <ButtonLink text="Continue without an account" onClick={() => console.log('Continue without an account')} />
          <XpmVerticalSpacer size="xs" />
        </CardV2>
      </div>
    </div>
  );
}

export default Home;

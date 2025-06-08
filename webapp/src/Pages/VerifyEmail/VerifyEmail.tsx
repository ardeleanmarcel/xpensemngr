import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getXpmErrCode } from '../../api/api.utils';
import { client } from '../../api/apiClient';
import { XpmButton } from '../../components/XpmButton';
import { XpmCard } from '../../components/XpmCard';
import { XpmCardContent } from '../../components/XpmCardContent';
import { VerifyEmailErrorMessages } from './VerifyEmailErrorMessages';

const useStyles = makeStyles<Theme>(() => ({
  container: {
    display: 'grid',
    gap: '50px',
    maxWidth: '300px',
    marginTop: '50px',
  },
}));

export const VerifyEmail = () => {
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const activationCode = queryParams.get('activationCode');

  if (!activationCode) {
    return;
  }

  const handleActivate = async () => {
    try {
      const response = await client.auth.activate.query(activationCode);
      setRegistrationStatus(response.success); // Activation successful
    } catch (error) {
      const code = getXpmErrCode(error);
      setErrorCode(code);
    }
  };

  const redirectToLoginPage = () => {
    navigate('/');
  };

  if (errorCode) {
    return <VerifyEmailErrorMessages errorCode={errorCode} />;
  }

  return (
    <XpmCard>
      <XpmCardContent
        sx={{
          textAlign: 'left',
        }}
      >
        <div className={classes.container}>
          {!registrationStatus ? (
            <>
              <div>
                Hello! Click on the button below in order to activate your account. The link is available maximum 24 hours!
              </div>
              <XpmButton variant="contained" color="secondary" onClick={handleActivate} buttonName="Complete Registration" />
            </>
          ) : (
            <>
              <div>
                Your registration is complete! We activated your account! Click on the button bellow and you will be redirected to
                login page! Enjoy!
              </div>
              <XpmButton variant="contained" color="secondary" onClick={redirectToLoginPage} buttonName="Login" />
            </>
          )}
        </div>
      </XpmCardContent>
    </XpmCard>
  );
};

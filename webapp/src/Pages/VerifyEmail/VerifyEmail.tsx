import { useLocation, useNavigate } from 'react-router-dom';
import { client } from '../../api/apiClient';
import { Button, Card, CardContent, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
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
  const [errorCode, setErrorCode] = useState('');
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
      const response = await client.users.activate.query(activationCode);
      setRegistrationStatus(response.success); // Activation successful
    } catch (error) {
      const code = error?.meta?.responseJSON[0]?.error?.data?.errorCode;
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
    <Card>
      <CardContent
        sx={{
          textAlign: 'left',
        }}
      >
        <div className={classes.container}>
          {!registrationStatus ? (
            <>
              <div>
                Hello! Click on the button below in order to activate your
                account. The link is available maximum 24 hours!
              </div>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleActivate}
              >
                Complete Registration
              </Button>
            </>
          ) : (
            <>
              <div>
                Your registration is complete! We activated your account! Click
                on the button bellow and you will be redirected to login page!
                Enjoy!
              </div>
              <Button
                variant="contained"
                color="secondary"
                onClick={redirectToLoginPage}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

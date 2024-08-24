export const VerifyEmailErrorMessages = ({ errorCode }) => {
  let message = '';
  if (errorCode === 400002) {
    message = 'This activation code has already been used.';
  } else if (errorCode === 400003) {
    message = 'This activation code has expired.';
  } else if (errorCode === 404001) {
    message = 'This activation code was not found.';
  }
  return <div>{message}</div>;
};

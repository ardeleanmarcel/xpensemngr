import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export function ForgotPassword() {
  return (
    <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
      Forgot your password? Click{' '}
      <Link href="reset-email" rel="noopener" target="_blank" sx={{}}>
        here
      </Link>{' '}
      to reset it.
    </Typography>
  );
}

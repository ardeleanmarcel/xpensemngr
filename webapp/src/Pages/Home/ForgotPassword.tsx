import Link from '@mui/material/Link';
import { XpmTypography } from '../../components/XpmTypography';

export function ForgotPassword() {
  return (
    <XpmTypography
      variant="subtitle2"
      align="center"
      text={
        <>
          {' '}
          Forgot your password? Click{' '}
          <Link href="reset-email" rel="noopener" target="_blank" sx={{}}>
            here
          </Link>{' '}
          to reset it.
        </>
      }
    />
  );
}

import { Navigate } from 'react-router-dom';

import { useUser } from '../../contexts/user/user.context';

type AuthProtectedProps = React.PropsWithChildren<{
  shouldRedirect?: boolean;
}>;

export const AuthProtected: React.FunctionComponent<AuthProtectedProps> = ({ children, shouldRedirect = true }) => {
  const { user } = useUser();

  if (!user && shouldRedirect) return <Navigate to="/" />;

  if (!user && !shouldRedirect) return null;

  return children;
};

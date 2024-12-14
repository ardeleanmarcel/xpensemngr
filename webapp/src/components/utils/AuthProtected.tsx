import { Navigate } from 'react-router-dom';

import { useUser } from '../../contexts/user/user.context';

export function AuthProtected({ children }: React.PropsWithChildren) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

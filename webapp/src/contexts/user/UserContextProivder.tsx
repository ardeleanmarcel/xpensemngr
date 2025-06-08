import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '../../api/apiClient';
import { PATH } from '../../constants/paths';
import { useRunOnce } from '../../hooks/useRunOnce';
import { extractAuthPayload } from '../../utils/auth.utils';
import { userContext, UserData } from './user.context';

const MILLISECONDS = {
  Minutes: {
    Five: 1000 * 60 * 5,
  },
};

// TODO (valle) -> implement an interval that checks for token expiration and refresh or revoke
export function UserContextProvider({ children }: Readonly<React.PropsWithChildren>) {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useRunOnce(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const { username, email, exp } = extractAuthPayload(token);

      const isOldToken = exp * 1000 < new Date().getTime() + MILLISECONDS.Minutes.Five;

      if (isOldToken) {
        localStorage.removeItem('authToken');
      } else {
        setUser({ username, email });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInitializing(false);
    }
  });

  const signIn = useCallback(async ({ username, password }: { username: string; password: string }) => {
    try {
      const { token } = await client.auth.signIn.mutate({ username, password });

      localStorage.setItem('authToken', token);
      const payload = extractAuthPayload(token);

      setUser({ username: payload.username, email: payload.email });

      return true;
    } catch (error) {
      console.error(error);
      console.log('caught the error');
      return false;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate(PATH.HomePage.Segment);
    return true;
  }, [navigate]);

  const contextValue = useMemo(() => ({ signIn, signOut, user }), [signIn, signOut, user]);

  if (isInitializing) return null;

  return <userContext.Provider value={contextValue}>{children}</userContext.Provider>;
}

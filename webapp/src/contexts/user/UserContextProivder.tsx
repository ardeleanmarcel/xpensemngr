import React, { useState } from 'react';
import { client } from '../../api/apiClient';
import { extractJwtPayload } from '../../utils/auth.utils';
import { userContext, UserData } from './user.context';
import { useRunOnce } from '../../hooks/useRunOnce';

// TODO (valle) -> implement an interval that checks for token expiration and refreseh or revoke
export function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useRunOnce(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const payload = extractJwtPayload(token);

      const { username, email, exp } = payload;

      const isExpired = exp * 1000 < new Date().getTime();

      if (isExpired) {
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

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const { token } = await client.auth.signIn.mutate({ username, password });

    localStorage.setItem('authToken', token);
    try {
      // TODO (Valle) -> add zod or similar to parse the value
      const parsedToken = extractJwtPayload(token);
      const { email } = parsedToken;

      setUser({ username, email });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function signOut() {
    localStorage.removeItem('authToken');
    setUser(null);
    return true;
  }

  if (isInitializing) return null;

  return (
    <userContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </userContext.Provider>
  );
}

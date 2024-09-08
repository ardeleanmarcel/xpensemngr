import React, { useState } from 'react';
import { client } from '../../api/apiClient';
import { extractJwtPayload } from '../../utils/auth.utils';
import { userContext, UserData } from './user.context';

export function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);

  // TODO (Valle) -> add useeffect to check for token in local storage and if it is not expired, then set the user

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
      console.log('parsedToken', parsedToken);
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

  return (
    <userContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </userContext.Provider>
  );
}

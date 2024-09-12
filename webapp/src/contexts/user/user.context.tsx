import React from 'react';

export type UserData = {
  username: string;
  email: string;
};

type UserContextType = {
  user: UserData | null;
  signIn: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

export const userContext = React.createContext<UserContextType>({
  user: null,
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(false),
});

export const useUser = () => {
  return React.useContext(userContext);
};

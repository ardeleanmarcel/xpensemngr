import React from 'react';

export type UserData = {
  username: string;
  email: string;
};

type UserContextType = {
  user: UserData | null;
  signIn: ({ username, password }: { username: string; password: string }) => Promise<boolean>;
  signOut: () => boolean | Promise<boolean>;
};

/*
The value passed to the context when it is created is just a placeholder.
The actual values used can be found in the UserContextProvider component.
This allows us to avoid null checks in components that consume this context.
*/
export const userContext = React.createContext<UserContextType>({
  user: null,
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(false),
});

export const useUser = () => {
  return React.useContext(userContext);
};

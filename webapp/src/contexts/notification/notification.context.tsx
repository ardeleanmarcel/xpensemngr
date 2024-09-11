import React from 'react';

export type SnackbarType = 'success' | 'error';
export type SnackbarConfig = {
  message: string;
  type: SnackbarType;
};

type NotificationContextType = {
  message: string;
  isVisible: boolean;
  displaySnackbar: ({ message, type }: SnackbarConfig) => void;
};

export const notificationContext = React.createContext<NotificationContextType>(
  {
    message: '',
    isVisible: false,
    displaySnackbar: () => null,
  }
);

export const useNotification = () => {
  return React.useContext(notificationContext);
};

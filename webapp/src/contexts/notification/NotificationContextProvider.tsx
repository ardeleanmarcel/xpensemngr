import React, { useRef, useState } from 'react';

import { notificationContext, SnackbarConfig, SnackbarType } from './notification.context';
import { NotificationSnackbar } from './NotificationSnackbar';

export function NotificationContextProvider({ children }: React.PropsWithChildren) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>(SnackbarType.Success);
  const [isVisible, setIsVisible] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function displaySnackbar({ message, type }: SnackbarConfig) {
    setMessage(message);
    setIsVisible(true);
    setType(type);

    timeout.current = setTimeout(() => {
      setMessage('');
      setIsVisible(false);
    }, 5_000);
  }

  function onClose() {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    setMessage('');
    setIsVisible(false);
  }

  return (
    <notificationContext.Provider value={{ displaySnackbar, isVisible, message }}>
      <NotificationSnackbar isOpen={isVisible} message={message} type={type} onClose={onClose} />
      {children}
    </notificationContext.Provider>
  );
}

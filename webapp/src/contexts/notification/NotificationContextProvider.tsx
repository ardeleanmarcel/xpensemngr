import React, { useCallback, useMemo, useRef, useState } from 'react';

import { InternalEventNotifier } from './InternalEventNotifier';
import { notificationContext, SnackbarConfig, SnackbarType } from './notification.context';
import { NotificationSnackbar } from './NotificationSnackbar';

export function NotificationContextProvider({ children }: Readonly<React.PropsWithChildren>) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>(SnackbarType.Success);
  // TODO (Valle) -> setting visibility in the context provider will trigger a re-render
  // of all components that use the notification context, which is not ideal.
  const [isVisible, setIsVisible] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displaySnackbar = useCallback(({ message, type }: SnackbarConfig) => {
    setMessage(message);
    setIsVisible(true);
    setType(type);

    timeout.current = setTimeout(() => {
      setMessage('');
      setIsVisible(false);
    }, 5_000);
  }, []);

  function onClose() {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    setMessage('');
    setIsVisible(false);
  }

  const contextValue = useMemo(
    () => ({
      displaySnackbar,
      isVisible,
      message,
    }),
    [displaySnackbar, isVisible, message]
  );

  return (
    <notificationContext.Provider value={contextValue}>
      <InternalEventNotifier />
      <NotificationSnackbar isOpen={isVisible} message={message} type={type} onClose={onClose} />
      {children}
    </notificationContext.Provider>
  );
}

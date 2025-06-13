import { useEffect, useRef } from 'react';

export enum INTERNAL_EVENT {
  AddExpenseSuccess = 'ADD_EXPENSE_SUCCESS',
}

type EventCallback = () => void;
type EventSubscriptions = {
  [K in INTERNAL_EVENT]: Array<EventCallback>;
};

class InternalEventCoordonator {
  subscriptions: EventSubscriptions = {
    [INTERNAL_EVENT.AddExpenseSuccess]: [],
  };

  subscribeTo(event: INTERNAL_EVENT, callback: EventCallback) {
    this.subscriptions[event].push(callback);
  }

  emitEvent(event: INTERNAL_EVENT) {
    this.subscriptions[event].forEach((callback) => callback());
  }

  unsubscribeFrom(event: INTERNAL_EVENT, callback: EventCallback) {
    this.subscriptions[event] = this.subscriptions[event].filter((cb) => cb !== callback);
  }
}

const eventCoordonator = new InternalEventCoordonator();

export function useInternalEvents() {
  const subscriptions = useRef<Array<{ event: INTERNAL_EVENT; callback: EventCallback }>>([]);

  function subscribeTo(event: INTERNAL_EVENT, callback: EventCallback) {
    const subscriptionExists = subscriptions.current.some((sub) => sub.event === event && sub.callback === callback);
    if (subscriptionExists) {
      console.warn(`Subscription for event ${event} already exists with callback ${callback}`);
      return;
    }

    subscriptions.current.push({ event, callback });
    eventCoordonator.subscribeTo(event, callback);
  }

  function emitEvent(event: INTERNAL_EVENT) {
    eventCoordonator.emitEvent(event);
  }

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subscriptions.current.forEach(({ event, callback }) => eventCoordonator.unsubscribeFrom(event, callback));
    };
  }, []);

  return { subscribeTo, emitEvent };
}

import { DomainName } from '../../types/types.domain.ts';

export type DomainEventName = `${DomainName}-${string}`;

export enum DomainEventNames {
  UserCreated = 'users-user.created',
  UserDeleted = 'users-user.deleted',
}
export interface IDomainEvent {
  name: DomainEventName;
  payload?: unknown;
}

export interface UserCreatedEvent extends IDomainEvent {
  name: DomainEventNames.UserCreated;
  payload: {
    userId: number;
    username: string;
    email: string;
  };
}

// user deletion event is not used. it is here to show how to
// create the DomainEvent type using a discriminated union
export interface UserDeletedEvent extends IDomainEvent {
  name: DomainEventNames.UserDeleted;
  payload: {
    userId: number;
    deletedAt: Date;
  };
}

export type DomainEvent = UserCreatedEvent | UserDeletedEvent;

export type DomainEventTypeMap = {
  [DomainEventNames.UserCreated]: UserCreatedEvent;
  [DomainEventNames.UserDeleted]: UserDeletedEvent;
};

export type DomainEventHandler = (event: DomainEvent) => void | Promise<void>;

export type DomainEventHandlers = Record<DomainEventName, Array<DomainEventHandler>>;

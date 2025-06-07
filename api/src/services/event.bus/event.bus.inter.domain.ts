import {
  DomainEvent,
  DomainEventHandler,
  DomainEventHandlers,
  DomainEventNames,
  DomainEventTypeMap,
} from './event.bus.types.ts';

class InterDomainEventBus {
  private readonly handlers: DomainEventHandlers = {
    [DomainEventNames.UserCreated]: [],
    [DomainEventNames.UserDeleted]: [],
  };

  on<T extends DomainEventNames>(name: T, handler: (event: DomainEventTypeMap[T]) => void | Promise<void>) {
    this.handlers[name].push(handler as DomainEventHandler);
  }

  async emit(event: DomainEvent): Promise<void> {
    const handlers = this.handlers[event.name];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}

let instance: InterDomainEventBus | null = null;

export const getInterDomainEventBus = () => {
  instance ??= new InterDomainEventBus();

  return instance;
};

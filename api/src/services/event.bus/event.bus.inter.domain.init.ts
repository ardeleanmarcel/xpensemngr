export function initEventListeners() {
  import('../../domains/auth/auth.event.listeners.ts');
  console.log('InterDomainEventBus initialized');
}

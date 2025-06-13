import { INTERNAL_EVENT, useInternalEvents } from '../../hooks/useInternalEvents';
import { useRunOnce } from '../../hooks/useRunOnce';
import { SnackbarType, useNotification } from './notification.context';

export const InternalEventNotifier = () => {
  const { subscribeTo } = useInternalEvents();
  const { displaySnackbar } = useNotification();

  useRunOnce(() => {
    subscribeTo(INTERNAL_EVENT.AddLabelSuccess, () => {
      displaySnackbar({
        message: 'Label added successfully!',
        type: SnackbarType.Success,
      });
    });
  });

  return <div>InternalEventNotifier</div>;
};

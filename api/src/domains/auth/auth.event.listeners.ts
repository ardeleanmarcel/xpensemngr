import { getInterDomainEventBus } from '../../services/event.bus/event.bus.inter.domain.ts';
import { DomainEventNames } from '../../services/event.bus/event.bus.types.ts';
import { notificationService } from '../../services/service.notification.ts';
import { ENV_VARS } from '../../utils/env.utils.ts';
import { createUserActivations } from './user_activations.sql.ts';

const bus = getInterDomainEventBus();

bus.on(DomainEventNames.UserCreated, async (event) => {
  const { userId, username, email } = event.payload;

  const activation = (await createUserActivations([userId]))[0];

  const confirmationUrl = `${ENV_VARS.MYE_WEB_UI_ROOT_URL}/verify-email?activationCode=${activation.activation_code}`;

  await notificationService.sendAccountConfirmationEmail({
    email,
    confirmationUrl,
    username,
  });
});

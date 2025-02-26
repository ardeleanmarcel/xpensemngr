import sendGrid from '@sendgrid/mail';

import { HTTP_ERR } from '../errors';
import { throwHttpError } from '@src/errors/error.utils';
import { ENV_VARS } from '@src/utils/env.utils';

enum SENDGRID_TEMPLATE {
  ConfirmNewUserEmail = 'd-58015a3de1ae41388cb70421f6e10224',
}

class NotificationService {
  private readonly emailClient: sendGrid.MailService;

  constructor() {
    this.emailClient = sendGrid;
    this.emailClient.setApiKey(process.env.SENDGRID_API_KEY ?? '');
  }

  public async sendAccountConfirmationEmail(cfg: { email: string; username: string; confirmationUrl: string }) {
    const sendgridConfig = {
      to: cfg.email,
      from: ENV_VARS.NOTIFICATION_EMAIL_SOURCE,
      subject: 'Confirm MYE account',
      templateId: SENDGRID_TEMPLATE.ConfirmNewUserEmail,
      dynamicTemplateData: {
        username: cfg.username,
        confirmationUrl: cfg.confirmationUrl,
      },
    };

    const res = await this.emailClient.send(sendgridConfig).catch((err) => {
      // TODO (Valle) -> improve error logging
      console.error(err);
      throwHttpError(HTTP_ERR.e500.Unavailable);
    });

    return res;
  }
}

export const notificationService = new NotificationService();

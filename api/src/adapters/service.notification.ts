import sendGrid from '@sendgrid/mail';

import { HttpError, HTTP_ERR } from '../errors';

// TODO (Valle) -> cann i add type annotation to EMAIL_TYPE: EmailConfigObjects to some [key]: { specific: 'object' } shape?
export const EMAIL_TYPE = {
  ConfirmNewUserEmail: {
    id: 'ConfirmNewUserEmail',
  },
} as const;
// TODO (Valle) -> can I type this so that the keys can only be a subset of EMAIL_TYPE's keys?
const SENDGRID_TEMPLATE = {
  ConfirmNewUserEmail: 'd-58015a3de1ae41388cb70421f6e10224',
} as const;

function getSendgridTemplateId(id: keyof typeof EMAIL_TYPE) {
  return SENDGRID_TEMPLATE[id];
}

class NotificationService {
  private emailClient: sendGrid.MailService;

  constructor() {
    this.emailClient = sendGrid;
    this.emailClient.setApiKey(process.env.SENDGRID_API_KEY ?? '');
  }

  // TODO (Valle) -> cfg type should depend on the email to be sent...
  public async sendAccountConfirmationEmail(cfg: { email: string; username: string; confirmationUrl: string }) {
    const sendgridConfig = {
      to: cfg.email,
      // TODO (Valle) -> export all env variables from a single file that will throw if anything is missing
      from: process.env.NOTIFICATION_EMAIL_SOURCE ?? '',
      subject: 'Confirm MYE account',
      templateId: getSendgridTemplateId('ConfirmNewUserEmail'),
      dynamicTemplateData: {
        username: cfg.username,
        confirmationUrl: cfg.confirmationUrl,
      },
    };

    const res = await this.emailClient.send(sendgridConfig).catch((err) => {
      // TODO (Valle) -> improve error logging
      console.error(err);
      throw new HttpError(HTTP_ERR.e500.Unavailable);
    });

    return res;
  }
}

export const notificationService = new NotificationService();

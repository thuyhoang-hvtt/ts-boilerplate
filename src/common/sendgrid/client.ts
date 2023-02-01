import { ClientResponse, MailService } from '@sendgrid/mail';

import LoggerMixing from '@/common/base/logger-mixing';
import SettingUtil from '@/utils/setting.util';

import { SendPayload, SGConfig } from './interfaces';

export default class SendgridClient extends LoggerMixing {
  private static instance: SendgridClient;
  private client: MailService;
  private config: SGConfig;
  protected loggerName = 'SendgridClient';

  constructor(config: SGConfig) {
    super();
    this.client = new MailService();
    this.client.setApiKey(config.apiKey);
    this.config = config;
  }

  static init(config: SGConfig) {
    SendgridClient.instance = new SendgridClient(config);
  }

  static getInstance(): SendgridClient {
    if (SendgridClient.instance == null) {
      throw new Error(
        'People forgot to init SendGrid. Put `SendGrid.init(config)` on where application is initialized, then try again.',
      );
    }
    return SendgridClient.instance;
  }

  async send(payload: SendPayload): Promise<ClientResponse> {
    try {
      const [response] = await this.client.send({
        from: this.config.from,
        replyTo: this.config.replyTo,
        to: payload.to,
        templateId: await SettingUtil.getSGTemplateId(payload.template),
        dynamicTemplateData: payload.data,
        subject: payload.subject,
        attachments: payload.attachments,
      });

      this.logger.info(`Send mail successfully: ${JSON.stringify(response, null, 2)}`);

      return response;
    } catch (ex) {
      this.logger.error(`Send mail failed due to: (${ex}). Payload: ${JSON.stringify(payload, null, 2)}`);
      throw new Error(ex);
    }
  }
}

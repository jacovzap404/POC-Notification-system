import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { Reminder } from 'src/types/reminder';
import * as AWS from 'aws-sdk';

@Injectable()
@Processor('notifications')
export class NotificationWorker {
  private sns: AWS.SNS;

  constructor() {
    this.sns = new AWS.SNS({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  @Process('sendNotification')
  async handleSendNotification(job: Job) {
    const { reminder }: { reminder: Reminder } = job.data;

    try {
      const gcmData = {
        title: 'LigaX',
        body: `Recordatorio: ${reminder.localTeam.teamName} vs ${reminder.visitorTeam.teamName} hoy a las ${reminder.eventTime}`,
        url: 'https://test.ligax.io/profile/417a746f-4aa0-49c6-a3ed-e39e286fedb8',
      };

      const params = {
        Message: JSON.stringify({
          default: `Recordatorio: ${reminder.localTeam.teamName} vs ${reminder.visitorTeam.teamName} hoy a las ${reminder.eventTime}`,
          GCM: JSON.stringify({ data: gcmData }),
        }),
        MessageStructure: 'json',
        Subject: 'Recordatorio',
        TopicArn: process.env.SNS_TOPIC_ARN,
      };

      await this.sns.publish(params).promise();

      console.log(
        `Notificación enviada para: ${reminder.localTeam.teamName} vs ${reminder.visitorTeam.teamName} a las ${reminder.eventTime}`,
      );
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  }
}

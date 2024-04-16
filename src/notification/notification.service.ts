import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Cron } from '@nestjs/schedule';

import { reminders } from 'src/data/remindersRepository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications')
    private readonly notificationsQueue: Queue,
  ) {
    this.sendReminders();
  }

  @Cron('0 1 * * *')
  handleCron() {
    this.sendReminders();
  }

  async sendReminders() {
    console.log('sendReminders');
    const reminders = await this.getRemindersForToday();
    reminders.forEach(async (reminder) => {
      const notificationTime = new Date(reminder.eventTime.getTime() - 60000);
      await this.scheduleNotification(notificationTime, reminder);
    });
  }

  private async getRemindersForToday() {
    console.log('getRemindersForToday');
    return reminders;
  }

  private async scheduleNotification(notificationTime: Date, reminder: any) {
    console.log('scheduleNotification');
    await this.notificationsQueue.add(
      'sendNotification',
      {
        reminder,
      },
      {
        delay: notificationTime.getTime() - Date.now(),
      },
    );
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import * as nodemailer from 'nodemailer';
import { DATABASE_CONNECTION } from '../../database/mongo.constants';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: Db,
  ) {}

  private get collection() {
    return this.db.collection('notifications');
  }

  private getTransporter() {
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        },
    });
    }

  async sendAlert({
    userId,
    type,
    score,
    entryText,
    recipientName,
    recipientEmail,
    userName,
  }: {
    userId: string;
    type: 'sponsor' | 'emergency';
    score: number;
    entryText: string;
    recipientName: string;
    recipientEmail: string;
    userName: string;
  }) {
    const subject =
      type === 'sponsor'
        ? `⚠️ ${userName} may need support`
        : `🚨 Urgent: ${userName} needs help`;

    const body =
      type === 'sponsor'
        ? `Hi ${recipientName},\n\nThis is an automated alert from Reclaim.
        \n\n${userName}'s recovery risk score has reached ${score}/100, which suggests they may be struggling.
        \n\nPlease consider reaching out to check in on them.\n\n— Reclaim`

        : `Hi ${recipientName},\n\nThis is an urgent alert from Reclaim.
        \n\n${userName}'s recovery risk score has reached ${score}/100. 
        This indicates a high risk of relapse and they may need immediate support.
        \n\nPlease contact them as soon as possible.\n\n— Reclaim`;

    try {
        await this.getTransporter().sendMail({
            from: `"Reclaim App" <${process.env.MAIL_FROM}>`,
            to: recipientEmail,
            subject,
            text: body,
        });
        this.logger.log(`✅ Email sent to ${recipientEmail}`);
        } catch (err) {
        this.logger.error(`Failed to send ${type} alert email`, err);
    }

    await this.collection.insertOne({
      userId: new ObjectId(userId),
      type,
      score,
      entryText,
      recipientName,
      recipientEmail,
      sentAt: new Date().toISOString(),
    });
  }

  async getForUser(userId: string) {
    return this.collection
      .find({ userId: new ObjectId(userId) })
      .sort({ sentAt: -1 })
      .toArray();
  }
}

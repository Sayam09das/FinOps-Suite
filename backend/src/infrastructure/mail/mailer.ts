import { Resend } from 'resend';
import { logger } from '../../config/logger';

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<any> {
  try {
    const data = await resend.emails.send({
      from: process.env.OWNER_EMAIL || 'no-reply@finops.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    logger.info({ to: options.to, subject: options.subject }, 'Email sent successfully');
    return data;
  } catch (error) {
    logger.error({ error, to: options.to }, 'Failed to send email');
    throw error;
  }
}

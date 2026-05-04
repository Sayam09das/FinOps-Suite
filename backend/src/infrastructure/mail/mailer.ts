import { Resend } from 'resend';
import { logger } from '../../config/logger';

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const getSenderAddress = (): string => {
  const configuredSender = process.env.EMAIL_FROM?.trim();

  if (configuredSender) {
    return configuredSender;
  }

  return 'FinOps Suite <onboarding@resend.dev>';
};

export async function sendEmail(options: SendEmailOptions): Promise<any> {
  try {
    const data = await resend.emails.send({
      from: getSenderAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(process.env.OWNER_EMAIL
        ? {
            replyTo: process.env.OWNER_EMAIL,
          }
        : {}),
    });

    logger.info(
      { to: options.to, subject: options.subject, from: getSenderAddress() },
      'Email sent successfully',
    );
    return data;
  } catch (error) {
    logger.error(
      {
        error,
        to: options.to,
        from: getSenderAddress(),
        ownerEmail: process.env.OWNER_EMAIL,
      },
      'Failed to send email',
    );
    throw error;
  }
}

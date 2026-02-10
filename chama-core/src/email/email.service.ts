import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: string;
  tags?: string[];
  params?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string | undefined;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor(private readonly configService: ConfigService) {
    // Configure Brevo API client
    this.apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!this.apiKey) {
      this.logger.warn(
        'BREVO_API_KEY not set. Email sending will be disabled.',
      );
    }

    this.senderEmail = this.configService.get<string>(
      'EMAIL_SENDER_ADDRESS',
      'no-reply@chamapp.com',
    );
    this.senderName = this.configService.get<string>(
      'EMAIL_SENDER_NAME',
      'Chama App',
    );
  }

  /**
   * Send an email using Brevo
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.apiKey) {
        this.logger.warn('Email not sent: BREVO_API_KEY not configured');
        this.logger.debug('Would have sent email:', options);
        return false;
      }

      const { to, subject, htmlContent, textContent, replyTo, tags, params } =
        options;

      // Create sender and email payload directly
      const emailData = {
        sender: {
          email: this.senderEmail,
          name: this.senderName,
        },
        to: to.map(email => ({ email })),
        subject,
        htmlContent,
        textContent,
        tags,
        params,
      };

      if (replyTo) {
        (emailData as any)['replyTo'] = { email: replyTo };
      }

      // Use fetch directly to send the email via Brevo API
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();
      this.logger.log(
        `Email sent successfully: ${JSON.stringify(responseData)}`,
      );
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send email: ${message}`, stack);
      return false;
    }
  }

  /**
   * Send an invite email
   */
  async sendInviteEmail(
    recipientEmail: string,
    chamaName: string,
    inviteToken: string,
    inviterName: string,
  ): Promise<boolean> {
    const inviteUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/invite/accept?token=${inviteToken}`;

    const subject = `You've been invited to join ${chamaName}`;

    // HTML content with styling
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6ee0;">You've Been Invited to Join ${chamaName}</h2>
        <p>Hello,</p>
        <p>${inviterName} has invited you to join their Chama group: <strong>${chamaName}</strong>.</p>
        <p>To accept this invitation and join the group, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Accept Invitation
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${inviteUrl}</p>
        <p>This invitation will expire in 7 days.</p>
        <p>If you don't have an account yet, you'll be able to create one when you accept the invitation.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">If you did not expect this invitation, you can safely ignore this email.</p>
      </div>
    `;

    // Plain text version for email clients that don't support HTML
    const textContent = `
You've Been Invited to Join ${chamaName}

Hello,

${inviterName} has invited you to join their Chama group: ${chamaName}.

To accept this invitation and join the group, please visit this link:
${inviteUrl}

This invitation will expire in 7 days.

If you don't have an account yet, you'll be able to create one when you accept the invitation.

If you did not expect this invitation, you can safely ignore this email.
    `;

    return this.sendEmail({
      to: [recipientEmail],
      subject,
      htmlContent,
      textContent,
      tags: ['invite'],
      params: {
        chamaName,
        inviteToken,
        inviterName,
      },
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  renderChamaInviteEmail,
  renderChamaInviteEmailText,
} from '../../emails';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: string;
}

export interface SendChamaInviteEmailOptions {
  to: string;
  inviterName: string;
  chamaName: string;
  inviteLink: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    // Get SMTP configuration from environment variables
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    this.senderEmail = this.configService.get<string>(
      'EMAIL_SENDER_ADDRESS',
      'no-reply@chamaplus.com',
    );
    this.senderName = this.configService.get<string>(
      'EMAIL_SENDER_NAME',
      'ChamaPlus',
    );

    // Check if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      const transportOptions: SMTPTransport.Options = {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure, // true for 465, false for other ports (587 uses STARTTLS)
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        // Connection settings
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true, // Enable debug output
        logger: true, // Log to console
      };
      
      // Force IPv4 connection (via socket options)
      (transportOptions as any).family = 4;
      
      this.transporter = nodemailer.createTransport(transportOptions);
      this.isConfigured = true;
      this.logger.log(`SMTP configured with host: ${smtpHost}:${smtpPort}`);
      this.logger.log(`SMTP user: ${smtpUser}`);
      this.logger.log(`Sender: "${this.senderName}" <${this.senderEmail}>`);

      // Verify connection on startup
      this.verifyConnection().then((success) => {
        if (success) {
          this.logger.log('✅ SMTP connection verified on startup');
        } else {
          this.logger.error('❌ SMTP connection verification failed on startup');
        }
      });
    } else {
      this.isConfigured = false;
      this.logger.warn(
        'SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables to enable email sending.',
      );
    }
  }

  /**
   * Send an email using SMTP transporter (nodemailer)
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter || !this.isConfigured) {
        this.logger.warn('Email not sent: SMTP not configured');
        this.logger.debug('Would have sent email:', {
          to: options.to,
          subject: options.subject,
        });
        return false;
      }

      const { to, subject, htmlContent, textContent, replyTo } = options;

      // Prepare recipient list
      const toList = Array.isArray(to) ? to.join(', ') : to;

      this.logger.log(`📧 Attempting to send email to: ${toList}`);
      this.logger.log(`📧 Subject: ${subject}`);
      this.logger.log(`📧 From: "${this.senderName}" <${this.senderEmail}>`);

      // Send email via nodemailer
      const info = await this.transporter.sendMail({
        from: `"${this.senderName}" <${this.senderEmail}>`,
        to: toList,
        subject,
        text: textContent,
        html: htmlContent,
        replyTo: replyTo,
      });

      this.logger.log(`✅ Email sent successfully!`);
      this.logger.log(`   Message ID: ${info.messageId}`);
      this.logger.log(`   Response: ${info.response}`);
      this.logger.log(`   Accepted: ${JSON.stringify(info.accepted)}`);
      this.logger.log(`   Rejected: ${JSON.stringify(info.rejected)}`);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`❌ Failed to send email: ${message}`, stack);
      return false;
    }
  }

  /**
   * Send an invite email using React Email template
   */
  async sendInviteEmail(
    recipientEmail: string,
    chamaName: string,
    inviteToken: string,
    inviterName: string,
  ): Promise<boolean> {
    const inviteUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/join-chama/${inviteToken}`;

    const subject = `You've been invited to join ${chamaName}`;

    try {
      // Render HTML and text content using React Email templates
      const htmlContent = await renderChamaInviteEmail({
        inviterName,
        chamaName,
        inviteLink: inviteUrl,
      });

      const textContent = await renderChamaInviteEmailText({
        inviterName,
        chamaName,
        inviteLink: inviteUrl,
      });

      return this.sendEmail({
        to: recipientEmail,
        subject,
        htmlContent,
        textContent,
      });
    } catch (error) {
      this.logger.error('Failed to render email template:', error);
      // Fallback to inline HTML if template rendering fails
      return this.sendInviteEmailFallback(
        recipientEmail,
        chamaName,
        inviteUrl,
        inviterName,
      );
    }
  }

  /**
   * Fallback invite email with inline HTML (used if React Email rendering fails)
   */
  private async sendInviteEmailFallback(
    recipientEmail: string,
    chamaName: string,
    inviteUrl: string,
    inviterName: string,
  ): Promise<boolean> {
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

    // Plain text version
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
      to: recipientEmail,
      subject,
      htmlContent,
      textContent,
    });
  }

  /**
   * Helper function: Send Chama invite email with all options
   * This is a convenience wrapper that can be used directly
   */
  async sendChamaInviteEmail(
    options: SendChamaInviteEmailOptions,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { to, inviterName, chamaName, inviteLink } = options;

      // Render the email using React Email template
      const htmlContent = await renderChamaInviteEmail({
        inviterName,
        chamaName,
        inviteLink,
      });

      const textContent = await renderChamaInviteEmailText({
        inviterName,
        chamaName,
        inviteLink,
      });

      const subject = `You've been invited to join ${chamaName}`;

      const success = await this.sendEmail({
        to,
        subject,
        htmlContent,
        textContent,
      });

      if (success) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to send email via SMTP' };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send chama invite email: ${message}`);
      return { success: false, error: message };
    }
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`SMTP connection verification failed: ${message}`);
      return false;
    }
  }
}

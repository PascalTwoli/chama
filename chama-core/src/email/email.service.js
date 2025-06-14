"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        // Configure Brevo API client
        this.apiKey = this.configService.get('BREVO_API_KEY');
        if (!this.apiKey) {
            this.logger.warn('BREVO_API_KEY not set. Email sending will be disabled.');
        }
        this.senderEmail = this.configService.get('EMAIL_SENDER_ADDRESS', 'no-reply@chamapp.com');
        this.senderName = this.configService.get('EMAIL_SENDER_NAME', 'Chama App');
    }
    /**
     * Send an email using Brevo
     */
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.apiKey) {
                    this.logger.warn('Email not sent: BREVO_API_KEY not configured');
                    this.logger.debug('Would have sent email:', options);
                    return false;
                }
                const { to, subject, htmlContent, textContent, replyTo, tags, params } = options;
                // Create sender and email payload directly
                const emailData = {
                    sender: {
                        email: this.senderEmail,
                        name: this.senderName
                    },
                    to: to.map(email => ({ email })),
                    subject,
                    htmlContent,
                    textContent,
                    tags,
                    params
                };
                if (replyTo) {
                    emailData['replyTo'] = { email: replyTo };
                }
                // Use fetch directly to send the email via Brevo API
                const response = yield fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey
                    },
                    body: JSON.stringify(emailData)
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
                }
                const responseData = yield response.json();
                this.logger.log(`Email sent successfully: ${JSON.stringify(responseData)}`);
                return true;
            }
            catch (error) {
                this.logger.error(`Failed to send email: ${error.message}`, error.stack);
                return false;
            }
        });
    }
    /**
     * Send an invite email
     */
    sendInviteEmail(recipientEmail, chamaName, inviteToken, inviterName) {
        return __awaiter(this, void 0, void 0, function* () {
            const inviteUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/invite/accept?token=${inviteToken}`;
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
                    inviterName
                }
            });
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);

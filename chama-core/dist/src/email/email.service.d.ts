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
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly senderEmail;
    private readonly senderName;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendInviteEmail(recipientEmail: string, chamaName: string, inviteToken: string, inviterName: string): Promise<boolean>;
}

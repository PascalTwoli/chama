import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Invite, Membership } from '@prisma/client';
export declare class InviteService {
    private readonly prisma;
    private readonly emailService;
    private readonly configService;
    private readonly logger;
    private readonly baseUrl;
    constructor(prisma: PrismaService, emailService: EmailService, configService: ConfigService);
    createInvite(createInviteDto: CreateInviteDto, requestUserId: string, sendEmail?: boolean): Promise<{
        invite: Invite;
        inviteLink: string;
    }>;
    validateAndAcceptInvite(token: string, userId: string): Promise<Membership>;
    listPendingInvites(chamaId: string, requestUserId: string): Promise<Invite[]>;
    getPendingInvitesForUser(email: string): Promise<Invite[]>;
    checkExistingInvite(chamaId: string, email: string): Promise<boolean>;
    sendInviteEmail(email: string, chamaName: string, token: string, inviterName: string): Promise<boolean>;
    generateInviteLink(token: string): string;
}

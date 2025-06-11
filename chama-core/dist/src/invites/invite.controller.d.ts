import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { AcceptInviteDto, CreateInviteDto } from './dto/create-invite.dto';
import { InviteService } from './invite.service';
import { InviteEntity } from './entities/invite.entity';
import { MembershipEntity } from './entities/membership.entity';
export declare class InviteController {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    createInvite(createInviteDto: CreateInviteDto, currentUser: CurrentUserType): Promise<InviteEntity>;
    listPendingInvites(chamaId: string, currentUser: CurrentUserType): Promise<InviteEntity[]>;
    acceptInvite(acceptInviteDto: AcceptInviteDto, currentUser: CurrentUserType): Promise<MembershipEntity>;
    getPendingInvitesForUser(currentUser: CurrentUserType): Promise<InviteEntity[]>;
    private handleError;
}

import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { ChamaService } from './chama.service';
import { CreateChamaDto } from './dto/create-chama.dto';
interface ChamaResponse {
    id: string;
    name: string;
    description?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    memberships: {
        id: string;
        chamaId: string;
        userId: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}
export declare class ChamaController {
    private readonly chamaService;
    constructor(chamaService: ChamaService);
    create(createChamaDto: CreateChamaDto, currentUser: CurrentUserType): Promise<ChamaResponse>;
    findAll(currentUser: CurrentUserType): Promise<ChamaResponse[]>;
    findOne(id: string, currentUser: CurrentUserType): Promise<ChamaResponse>;
}
export {};

import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { FirebaseUserEntity, UserResponseEntity } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(currentUser: CurrentUserType): Promise<{
        users: FirebaseUserEntity[];
        pageToken?: string;
    }>;
    findOne(id: string): Promise<UserResponseEntity>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: CurrentUserType): Promise<FirebaseUserEntity>;
    remove(id: string, currentUser: CurrentUserType): Promise<{
        message: string;
    }>;
}

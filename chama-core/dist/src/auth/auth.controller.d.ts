import { LoginDto } from '../user/dto/login.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginResponse } from '../user/user.service';
import { UserService } from '../user/user.service';
import { type CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { UserResponseEntity } from '../user/entities/user.entity';
interface TokenRefreshResponse {
    idToken: string;
    refreshToken: string;
    expiresIn: string;
}
export declare class AuthController {
    private readonly userService;
    constructor(userService: UserService);
    registerUser(registerUserDto: RegisterUserDto): Promise<LoginResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    refreshAuth(refreshToken: string): Promise<TokenRefreshResponse>;
    getCurrentUser(currentUser: CurrentUserType): Promise<UserResponseEntity>;
}
export {};

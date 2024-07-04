import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";

import UsersEntity from "./users.entity";
import { helper } from "../helpers/misc.helper.service";

export class UserDto extends UsersEntity { };

export class CreateUserDto extends OmitType(UserDto, ['id', 'verified', 'contacts']) { };

export class SignInDto extends PickType(UserDto, ['email', 'password']) { };

export class SignInResponseDto extends UserDto {
    @ApiProperty(helper.getApiProperty('authToken'))
    token: string;
};
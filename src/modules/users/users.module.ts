import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import UsersEntity from "./users.entity";

import { UsersController } from "./users.controller";

import { UsersService } from "./users.service";
import JwtHelperModule from "../helpers/jwt.helper.module";
import RepoHelperModule from "../helpers/repo.helper.module";
import BcryptHelperModule from "../helpers/bcrypt.helper.module";
import MailHelperModule from "../helpers/mail.helper.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        JwtHelperModule,
        RepoHelperModule,
        BcryptHelperModule,
        MailHelperModule,
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export default class UsersModule { };
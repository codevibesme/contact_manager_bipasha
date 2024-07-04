import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ContactsEntity from "./contacts.entity";

import { ContactsController } from "./contacts.controller";
import { ContactsService } from "./contacts.service";
import RepoHelperModule from "../helpers/repo.helper.module";
import JwtHelperModule from "../helpers/jwt.helper.module";
import BcryptHelperModule from "../helpers/bcrypt.helper.module";
import MailHelperModule from "../helpers/mail.helper.module";
import TxnHelperModule from "../helpers/txn.helper.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ContactsEntity]),
        RepoHelperModule,
        JwtHelperModule,
        BcryptHelperModule,
        MailHelperModule,
        TxnHelperModule
    ],
    controllers: [ContactsController],
    providers: [ContactsService],
    exports: [ContactsService]
})
export default class ContactsModule { };
import { Module } from "@nestjs/common";
import { MailHelpersService } from "./mail.helper.service";

@Module({
    providers: [MailHelpersService],
    exports: [MailHelpersService],
})
export default class MailHelperModule { };
import { Module } from "@nestjs/common";

import { BcryptHelperService } from "./bcrypt.helper.service";

@Module({
    providers: [BcryptHelperService],
    exports: [BcryptHelperService]
})
export default class BcryptHelperModule { };
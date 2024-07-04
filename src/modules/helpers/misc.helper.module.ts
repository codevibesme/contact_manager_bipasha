import { Module } from "@nestjs/common";

import { MiscHelperService } from "./misc.helper.service";

@Module({
    providers: [MiscHelperService],
    exports: [MiscHelperService]
})
export default class MiscHelperModule { };
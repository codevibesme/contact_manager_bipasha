import { Module } from "@nestjs/common";

import { TxnHelperService } from "./txn.helper.service";

@Module({
    imports: [],
    controllers: [],
    providers: [TxnHelperService],
    exports: [TxnHelperService]
})

export default class TxnHelperModule { };
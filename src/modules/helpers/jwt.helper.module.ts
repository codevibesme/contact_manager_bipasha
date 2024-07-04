import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtHelperService } from "./jwt.helper.service";

@Module({
    imports: [
        JwtModule.register({
            secret: 'bFd1e9fSw8O4imm24cqibh0i6GBimmFn6jJyprogmved',
        }),
    ],
    controllers: [],
    providers: [JwtHelperService],
    exports: [JwtHelperService]
})

export default class JwtHelperModule { };
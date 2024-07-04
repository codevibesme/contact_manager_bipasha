import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { entities } from "../entities.export";

import * as helpers from "./repo.helper.service";

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
    ],
    providers: [
        helpers.RepoHelperService,
        helpers.PureUserService,
        helpers.PureContactService,
    ],
    exports: [helpers.RepoHelperService]
})
export default class RepoHelperModule { };
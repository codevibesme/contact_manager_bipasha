import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import ContactsEntity from "../contacts/contacts.entity";

import { helper } from "../helpers/misc.helper.service";

@Entity("users")
export default class UsersEntity {
    @ApiProperty(helper.getApiProperty('userId'))
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ApiProperty(helper.getApiProperty('userName'))
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty(helper.getApiProperty('userEmail'))
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @ApiProperty(helper.getApiProperty('userPassword'))
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @ApiProperty(helper.getApiProperty('userVerified'))
    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @OneToMany(() => ContactsEntity, contact => contact.user)
    contacts: ContactsEntity[];
};
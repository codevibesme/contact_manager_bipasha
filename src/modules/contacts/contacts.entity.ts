import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import UsersEntity from "../users/users.entity";

import { helper } from "../helpers/misc.helper.service";

@Entity("contacts")
export default class ContactsEntity {
    @ApiProperty(helper.getApiProperty('contactId'))
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ApiProperty(helper.getApiProperty('contactPostalAddress'))
    @Column({ type: 'varchar', length: 255, nullable: false })
    postal_address: string;

    @ApiProperty(helper.getApiProperty('contactPhoneNumber'))
    @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
    phone_number: string;

    @ApiProperty(helper.getApiProperty('userId'))
    @Column({ name: 'user_id', type: 'int', nullable: false })
    user_id: number;

    @ManyToOne(() => UsersEntity, user => user.contacts)
    @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_contacts_user' })
    user: UsersEntity;
};
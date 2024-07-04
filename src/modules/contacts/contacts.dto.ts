import { ApiProperty, OmitType } from "@nestjs/swagger";
import ContactsEntity from "./contacts.entity";
import { helper } from "../helpers/misc.helper.service";

export class ContactDto extends ContactsEntity { };

export class CreateContactDto extends OmitType(ContactsEntity, ['id', 'user_id', 'user']) {
    @ApiProperty(helper.getApiProperty('userName'))
    name: string;

    @ApiProperty(helper.getApiProperty('userEmail'))
    email: string;
};
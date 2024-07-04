import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import ContactsEntity from "../contacts/contacts.entity";
import UsersEntity from "../users/users.entity";

import { CreateUserDto, UserDto } from "../users/users.dto";
import { ContactDto, CreateContactDto } from "../contacts/contacts.dto";

export class PureUserService {
    constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) { }

    async getUserById(id: number) {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async createUser(record: CreateUserDto, txnManager?: EntityManager): Promise<UserDto> {
        const newUser = this.usersRepository.create(record);

        if (txnManager) {
            return await txnManager.save(newUser);
        }

        return await this.usersRepository.save(newUser);
    }

    async getUserByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email } });
    }
}

export class PureContactService {
    constructor(@InjectRepository(ContactsEntity) private contactsRepository: Repository<ContactsEntity>) { }

    async getContactById(id: number) {
        return await this.contactsRepository.findOne({ where: { id } });
    }

    async createContact(contact: Object, txnManager?: EntityManager): Promise<ContactDto> {
        const newContact = this.contactsRepository.create(contact);

        if (txnManager) {
            return await txnManager.save(newContact);
        }

        return await this.contactsRepository.save(newContact);
    }

    async getContactsByUserId(userId: number) {
        return await this.contactsRepository.find({ where: { user_id: userId } });
    }
}

@Injectable()
export class RepoHelperService {
    constructor(
        private readonly pureUserService: PureUserService,
        private readonly pureContactService: PureContactService,
    ) { }

    // Users
    async getUserById(id: number) {
        return await this.pureUserService.getUserById(id);
    }

    async createUser(record: CreateUserDto, txnManager?: EntityManager) {
        return await this.pureUserService.createUser(record, txnManager);
    }

    async getUserByEmail(email: string) {
        return await this.pureUserService.getUserByEmail(email);
    }

    // Contacts
    async getContactById(id: number) {
        return await this.pureContactService.getContactById(id);
    }

    async createContact(contact: Object, txnManager?: EntityManager) {
        return await this.pureContactService.createContact(contact, txnManager);
    }

    async getContactsByUserId(userId: number) {
        return await this.pureContactService.getContactsByUserId(userId);
    }
};
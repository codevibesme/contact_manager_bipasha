import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ContactsEntity from "../contacts/contacts.entity";
import UsersEntity from "../users/users.entity";

import { CreateUserDto } from "../users/users.dto";

export class PureUserService {
    constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>) { }

    async getUserById(id: number) {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async createUser(record: CreateUserDto) {
        const newUser = this.usersRepository.create(record);
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

    async createContact(contact: ContactsEntity) {
        return await this.contactsRepository.save(contact);
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

    async createUser(record: CreateUserDto) {
        return await this.pureUserService.createUser(record);
    }

    async getUserByEmail(email: string) {
        return await this.pureUserService.getUserByEmail(email);
    }

    // Contacts
    async getContactById(id: number) {
        return await this.pureContactService.getContactById(id);
    }

    async createContact(contact: ContactsEntity) {
        return await this.pureContactService.createContact(contact);
    }

    async getContactsByUserId(userId: number) {
        return await this.pureContactService.getContactsByUserId(userId);
    }
};
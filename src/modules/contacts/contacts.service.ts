import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import ContactsEntity from "./contacts.entity";
import { Repository } from "typeorm";
import { TxnHelperService } from "../helpers/txn.helper.service";
import { ContactDto, CreateContactDto } from "./contacts.dto";
import { RepoHelperService } from "../helpers/repo.helper.service";
import { UserDto } from "../users/users.dto";
import { BcryptHelperService } from "../helpers/bcrypt.helper.service";
import { MailHelpersService } from "../helpers/mail.helper.service";
import { JwtHelperService } from "../helpers/jwt.helper.service";

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(ContactsEntity) private contactsRepository: Repository<ContactsEntity>,
        private readonly repo: RepoHelperService,
        private readonly txn: TxnHelperService,
        private readonly bcrypt: BcryptHelperService,
        private readonly mail: MailHelpersService,
        private readonly jwt: JwtHelperService,
    ) { }

    async createContact(adminId: number, createContactDto: CreateContactDto): Promise<ContactDto> {
        const { email, name, phone_number, postal_address } = createContactDto;

        const phoneNumber = await this.contactsRepository.findOne({ where: { phone_number } });
        if (phoneNumber) {
            throw new BadRequestException('Phone number already exists.');
        }


        const admin = await this.repo.getUserById(adminId);
        if (!admin) {
            throw new BadRequestException('Admin does not exist.');
        }

        if (!admin.verified) {
            throw new ConflictException('You are not verified.');
        }

        const user = await this.repo.getUserByEmail(email);
        if (user) {
            return await this.repo.createContact({ phone_number: phone_number, postal_address: postal_address, user_id: user.id });
        }

        let transaction = null;
        try {
            transaction = await this.txn.createTransaction();
            await transaction.startTransaction();

            const txnManager = transaction.transactionManager;

            const defaultPassword = `${name.toUpperCase().slice(0, 4)}_${new Date().getFullYear()}`;
            const hashedPassword = await this.bcrypt.hashPassword(defaultPassword);

            const newUser = await this.repo.createUser({ email, name, password: hashedPassword }, txnManager);

            const token = await this.jwt.generateToken({ userId: newUser.id }, '8h');

            await this.mail.sendVerificationEmail(email, `${process.env.CLIENT_URL}/verify-user/${token}`, defaultPassword);

            await this.repo.createContact({ phone_number: phone_number, postal_address: postal_address, user_id: newUser.id }, txnManager);

            await transaction.commitTransaction();
        } catch (error) {
            if (transaction) {
                await transaction.rollbackTransaction();
            }

            throw new BadRequestException(error.message);
        } finally {
            if (transaction) {
                await transaction.releaseTransaction();
            }
        }
    };

    async getContacts(userId: number, start: number, end: number): Promise<ContactDto[]> {
        const user = await this.repo.getUserById(userId);
        if (!user) {
            throw new BadRequestException('User does not exist.');
        }

        if (!user.verified) {
            throw new ConflictException('You are not verified.');
        }

        return await this.contactsRepository
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.user', 'user')
            .skip(start - 1)
            .take(end)
            .getMany();
    }

    async searchContacts(userId: number, query: string): Promise<ContactDto[]> {
        const user = await this.repo.getUserById(userId);
        if (!user) {
            throw new BadRequestException('User does not exist.');
        }

        if (!user.verified) {
            throw new ConflictException('You are not verified.');
        }

        return await this.contactsRepository
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.user', 'user')
            .where('LOWER(user.name) LIKE :query OR LOWER(contact.phone_number) LIKE :query', { query: `%${query.toLowerCase()}%` })
            .getMany();
    }
};
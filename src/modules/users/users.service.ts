import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import UsersEntity from "./users.entity";

import { RepoHelperService } from "../helpers/repo.helper.service";
import { JwtHelperService } from "../helpers/jwt.helper.service";
import { BcryptHelperService } from "../helpers/bcrypt.helper.service";
import { MailHelpersService } from "../helpers/mail.helper.service";

import { CreateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
        private readonly repo: RepoHelperService,
        private readonly jwt: JwtHelperService,
        private readonly bcrypt: BcryptHelperService,
        private readonly mail: MailHelpersService,
    ) { }

    async signUpUser(createUserDto: CreateUserDto): Promise<void> {
        const { name, email, password } = createUserDto;

        let user = await this.repo.getUserByEmail(email);
        if (user) {
            throw new ConflictException('User already exists.');
        }

        const hashedPassword = await this.bcrypt.hashPassword(password);

        const newUser = await this.repo.createUser({ name, email, password: hashedPassword });

        const token = await this.jwt.generateToken({ userId: newUser.id }, '1h');

        await this.mail.sendVerificationEmail(newUser.email, `${process.env.CLIENT_URL}/verify-user/${token}`)
    }

    async verifyUser(userId: number): Promise<void> {
        const user = await this.repo.getUserById(userId);
        if (!user) {
            throw new NotFoundException('User does not exist.');
        }

        user.verified = true;

        await this.usersRepository.save(user);
    }


    async signInUser(email: string, password: string) {
        const user = await this.repo.getUserByEmail(email);
        if (!user) {
            throw new NotFoundException('User does not exist.');
        }

        const isPasswordMatch = await this.bcrypt.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            throw new ConflictException('Invalid credentials.');
        }

        const token = await this.jwt.generateToken({ userId: user.id }, '8h');

        return token;
    }
}
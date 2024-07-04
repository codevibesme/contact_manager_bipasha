import { BadRequestException, Body, Controller, Get, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { UsersService } from "./users.service";

import { JwtHelperService } from "../helpers/jwt.helper.service";

import { CreateUserDto, SignInDto, UserDto } from "./users.dto";


@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwt: JwtHelperService,
    ) { }

    @Post('sign-up')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Sign up an user.' })
    @ApiOkResponse({ description: 'User Signed Up successfully.' })
    @ApiConflictResponse({ description: 'User already exists.' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async signUpUser(@Req() request: Request, @Res() response: Response, @Body() createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;
        if (!name?.trim()?.length || !email?.trim()?.length || !password?.trim()?.length) {
            throw new BadRequestException('Name, email and password are required.')
        }

        try {
            await this.usersService.signUpUser(createUserDto);

            return response.status(201).send('User Signed Up successfully.');
        } catch (error) {
            throw error;
        }
    }

    @Patch('verify-user')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Verify an user.' })
    @ApiOkResponse({ description: 'User verified successfully.' })
    @ApiNotFoundResponse({ description: 'User does not exist.' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async verifyUser(@Req() request: Request, @Res() response: Response) {
        const decodedToken = await this.jwt.verifyToken(request?.headers?.authorization, 'user');

        try {
            await this.usersService.verifyUser(decodedToken.userId);

            return response.status(200).send('User verified successfully.');
        } catch (error) {
            throw error;
        }
    }

    @Get('sign-in')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Sign in an user.' })
    @ApiQuery({ name: 'email', example: 'johndoe@gmail.com', required: true })
    @ApiQuery({ name: 'password', example: 'pass1234', required: true })
    @ApiOkResponse({ description: 'User Signed In successfully.' })
    @ApiNotFoundResponse({ description: 'User does not exist.' })
    @ApiConflictResponse({ description: 'Invalid credentials.' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async signInUser(@Req() request: Request, @Res() response: Response, @Query('email') email: string, @Query('password') password: string) {
        if (!email?.trim()?.length || !password?.trim()?.length) {
            throw new BadRequestException('Email and password are required.')
        }

        try {
            const token = await this.usersService.signInUser(email, password);

            return response.status(200).send(token);
        } catch (error) {
            throw error;
        }
    }
};  
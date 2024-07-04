import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ContactDto, CreateContactDto } from "./contacts.dto";
import { Request, Response } from "express";
import { ContactsService } from "./contacts.service";
import { JwtHelperService } from "../helpers/jwt.helper.service";

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
        private readonly jwt: JwtHelperService,
    ) { }
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new contact.' })
    @ApiBody({ type: CreateContactDto })
    @ApiOkResponse({ type: ContactDto })
    @ApiConflictResponse({ description: 'You are not verified.' })
    @ApiBadRequestResponse({ description: 'Failed to create contact.' })
    async createContact(@Req() request: Request, @Res() response: Response, @Body() createContactDto: CreateContactDto) {
        const decodedToken = await this.jwt.verifyToken(request.headers.authorization, 'user');

        const { email, name, phone_number, postal_address } = createContactDto;
        if (!email?.trim().length || !name?.trim().length || !phone_number?.trim().length || !postal_address?.trim().length) {
            throw new BadRequestException('name, email, phone_number, and postal_address are required fields');
        }

        try {
            const contact = await this.contactsService.createContact(decodedToken.userId, createContactDto);
            return response.status(201).send(contact);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all contacts.' })
    @ApiQuery({ name: 'start', example: 1, required: true })
    @ApiQuery({ name: 'end', example: 10, required: true })
    @ApiOkResponse({ type: ContactDto, isArray: true })
    @ApiConflictResponse({ description: 'You are not verified.' })
    @ApiBadRequestResponse({ description: 'Failed to get contacts.' })
    async getContacts(@Req() request: Request, @Res() response: Response, @Query('start') start: number, @Query('end') end: number) {
        const decodedToken = await this.jwt.verifyToken(request.headers.authorization, 'user');

        if (!start || !end) {
            throw new BadRequestException('start and end are required fields');
        }

        try {
            const contacts = await this.contactsService.getContacts(decodedToken.userId, start, end);
            return response.status(200).send(contacts);
        } catch (error) {
            throw error;
        }
    }

    @Get('search')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Search for contacts by name and phone number.' })
    @ApiQuery({ name: 'query', example: 'John Doe / 9123784891', required: true })
    @ApiOkResponse({ type: ContactDto, isArray: true })
    @ApiConflictResponse({ description: 'You are not verified.' })
    @ApiBadRequestResponse({ description: 'Failed to search contacts.' })
    async searchContacts(@Req() request: Request, @Res() response: Response, @Query('query') query: string) {
        const decodedToken = await this.jwt.verifyToken(request.headers.authorization, 'user');

        if (!query?.trim()?.length) {
            throw new BadRequestException('query is a required field');
        }

        try {
            const contacts = await this.contactsService.searchContacts(decodedToken.userId, query);
            return response.status(200).send(contacts);
        } catch (error) {
            throw error;
        }
    }

};
import { Injectable } from "@nestjs/common";

@Injectable()
export class MiscHelperService {
    constructor() { }
    getApiProperty(propertyName: string): Object {
        interface ApiProperties {
            [key: string]: Object;
        };

        const apiProperties: ApiProperties = {
            userId: {
                type: 'string',
                description: 'The user ID',
                example: '1',
            },
            userName: {
                type: 'string',
                description: 'The user name',
                example: 'John Doe',
            },
            userEmail: {
                type: 'string',
                description: 'The user email',
                example: 'johndoe@gmail.com'
            },
            userPassword: {
                type: 'string',
                description: 'The user password',
                example: 'password'
            },
            userVerified: {
                type: 'boolean',
                description: 'The user verification status',
                example: 'true'
            },
            authToken: {
                type: 'string',
                description: 'The authentication token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNjI5MzQwNjIyLCJleHAiOjE2MjkzNDQyMjJ9.7Z',
            },
            contactId: {
                type: 'string',
                description: 'The contact ID',
                example: '1',
            },
            contactPostalAddress: {
                type: 'string',
                description: 'The contact postal address',
                example: '123 Main St, New York, NY 10001',
            },
            contactPhoneNumber: {
                type: 'string',
                description: 'The contact phone number',
                example: '1234567890',
            },

        }
        return apiProperties[propertyName];
    }
};
export const helper = new MiscHelperService();
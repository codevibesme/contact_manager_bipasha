import { BadRequestException } from "@nestjs/common";

import { createTransport, Transporter } from "nodemailer";

import { MailOptions } from "nodemailer/lib/json-transport";

export class MailHelpersService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async sendVerificationEmail(userEmail: string, url: string, password?: string) {
        const mailOptions: MailOptions = {
            from: process.env.MAIL_USER,
            to: userEmail,
            subject: "Verification Code - Contact Manager App",
            text: `${password ? 'Log in with this password: ' + password : ''}\n\nClick on this link to verify your account: ${url}`,
        }

        try {
            this.transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    console.error("Error sending email: ", error);
                } else {
                    console.log("Email sent: ", info.response);
                }
            });
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Failed to send verification email');
        }
    }
};
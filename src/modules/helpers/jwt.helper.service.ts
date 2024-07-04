import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtHelperService {
    constructor(
        private readonly jwt: JwtService
    ) { }

    async generateToken(payload: Object, expiresIn: string): Promise<string> {
        return this.jwt.signAsync(payload, { expiresIn: expiresIn });
    };

    async verifyToken(token: string | undefined | null, tokenFor: string): Promise<any> {
        if (!token || !tokenFor) throw new UnauthorizedException('Authorization token missing');

        try {
            token = token?.replace('Bearer ', '');
            const decodedToken = await this.jwt.verifyAsync(token);
            if (tokenFor === 'user' && !decodedToken.userId) {
                throw new UnauthorizedException('Invalid token');
            }

            return decodedToken;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else {
                throw new UnauthorizedException('Invalid token');
            }
        }
    };
};
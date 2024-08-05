import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";
import { BadRequestException } from "@nestjs/common";

const scrypt = promisify(_scrypt);

export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: number) {
        const users = await this.usersService.find(email);

        if (!users.length) {
            throw new BadRequestException("User already exist");
        }

        const salt = randomBytes(8).toString('hex');

        const saltPassword = salt + '.' + password;

        const hash = (await scrypt(saltPassword, salt, 32)) as Buffer;

        const res = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, res);

        return user;
    }
}
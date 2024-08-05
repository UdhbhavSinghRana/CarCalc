import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);

        if (users.length) {
            throw new BadRequestException("User already exist");
        }

        const salt = randomBytes(8).toString('hex');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        const res = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, res);

        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const [salt, storedHash] = user.password.split('.');
        console.log(salt);

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        console.log(hash.toString('hex'));

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException("Wrong password");
        }

        return user;
    }
}
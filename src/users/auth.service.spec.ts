import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "./user.entity"
import { UsersService } from "./users.service"
import { BadRequestException, NotFoundException } from "@nestjs/common"
let service: AuthService
let fakeUserService: Partial<UsersService>

describe('AuthService test', () => {
    beforeAll(async () => {
        const users: User[] = [];
        fakeUserService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers)
            },
            create: (email, password) => {
                const user = {
                    id: Math.floor(Math.random() * 10000),
                    email,
                    password
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ]
        }).compile()
    
        service = module.get(AuthService)
    })
    
    it('testing for auth', () => {
        expect(service).toBeDefined();
    })

    it('creates hash for password', async () => {
        const user = await service.signup('abcd@gmail.com', 'abcd123');

        expect(user.password).not.toEqual('abcd123');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user not found', async () => {
        await expect(service.signin('abcdx@gmial.com', 'abcxd123')).rejects.toThrow(
            NotFoundException,
        );
    })

    it('throws an error if user already exist', async () => {
        await service.signup('abcdx@gmial.com', 'abcxd123');
        await expect(service.signup('abcdx@gmial.com', 'abcxd123')).rejects.toThrow(
            BadRequestException,
        );
    })

    it("throws an error if password is wrong", async () => {
        await service.signup('abcdxx@gmail.com', '1234');
        await expect(service.signin('abcdxx@gmail.com', '12345')).rejects.toThrow(
            BadRequestException  // correct password: 1234
        );
    })

    it("returns a user if password is correct", async () => {
        await service.signup('123@gmail.com', '1234');
        const user = await service.signin('123@gmail.com', '1234');
        expect(user).toBeDefined()
    })
})


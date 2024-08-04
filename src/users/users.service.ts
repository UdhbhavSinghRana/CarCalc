import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo : Repository<User>) {}

    async create(email: string, password: string) {
        const user = this.repo.create({email, password});

        return await this.repo.save(user);
    }

    findOne(id: number) {
        const user =  this.repo.findOneBy({ id });

        if (!user) {
            throw new NotFoundException("user not found");
        }

        return user;
    }

    async find(email: string) {
        const user =  await this.repo.find({ where: { email }});

        if (!user || user.length == 0) {
            throw new NotFoundException("user not found");
        }

        return user;
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException("user not found");
        }

        Object.assign(user, attrs);

        return await this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException("user not found");
        }

        return await this.repo.delete(user);
    }
}

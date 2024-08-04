import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.create(body.email, body.password);
    }

    @UseInterceptors(SerializeInterceptor)
    @Get('/:id') 
    findUser(@Param('id') id: number) {
        return this.usersService.findOne(id); // tutorial said to user string
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: number) {
        return this.usersService.remove(id); 
    }

    @Patch('/:id')
    updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.usersService.update(id, body);
    }
}

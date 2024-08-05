import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@UseInterceptors(new SerializeInterceptor(UserDto))
@Controller('auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password);
    }

    @Get('/signin')
    singinUser(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password);
    }

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

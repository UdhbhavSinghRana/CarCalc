import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    email: string;
}
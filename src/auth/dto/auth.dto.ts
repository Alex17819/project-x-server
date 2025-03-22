import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Role } from "@prisma/client";

export class BaseAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

export class RegisterDto extends BaseAuthDto {
  @IsEnum(Role, { message: "Role must be TEACHER or USER" })
  role: Role;
}

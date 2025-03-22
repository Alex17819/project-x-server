import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser({
    email,
    hashedPassword,
    role,
  }: {
    email: string;
    hashedPassword: string;
    role: Role;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (role === Role.ADMIN) {
      throw new ForbiddenException("Access Denied");
    }

    if (user) {
      throw new BadRequestException("The user already exists");
    }

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("The user does not exists");
    }

    return user;
  }
}

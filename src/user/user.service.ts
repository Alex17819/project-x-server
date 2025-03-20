import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "../auth/dto/auth.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(email: string, hashedPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new BadRequestException("The user already exists");
    }

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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

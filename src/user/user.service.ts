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
      throw new ForbiddenException("Acces respins");
    }

    if (user) {
      throw new BadRequestException("Utilizatorul există deja");
    }

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roles: [role],
      },
    });
  }

  async updateUser(data: {
    email?: string;
    hashedPassword?: string;
    role?: Role;
    refreshToken?: string;
  }) {
    return this.prisma.user.update({
      data,
      where: { email: data.email },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Utilizatorul există deja");
    }

    return user;
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projects: {},
        ProjectUser: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException("The user does not exists");
    }

    return user;
  }
}

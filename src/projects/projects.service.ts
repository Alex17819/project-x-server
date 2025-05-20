import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project-dto";
import { ShareProjectDto } from "./dto/share-project.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async getProjectData(userId: number, projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async createProject(createProjectDto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        blocks: createProjectDto.blocks,
        users: {
          connect: [{ id: userId }],
        },
      },
    });
  }

  async shareProject(shareProjectDto: ShareProjectDto, userId: number) {
    const { userId: userToShareId, projectId } = shareProjectDto;

    const projectToShare = await this.getProjectData(userId, Number(projectId));

    return this.prisma.user.update({
      where: {
        id: Number(userToShareId),
      },
      data: {
        projects: {
          connect: {
            id: projectToShare?.id,
          },
        },
      },
    });
  }

  async updateProject(
    createProjectDto: CreateProjectDto,
    userId: number,
    projectId: number,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        users: {
          some: { id: userId },
        },
      },
    });

    if (!project) {
      throw new Error("Access denied or project not found");
    }

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        blocks: createProjectDto.blocks,
      },
    });
  }
}

import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project-dto";
import { ShareProjectDto } from "./dto/share-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatProjectResponse(project: any) {
    return {
      id: project.id,
      blocks: project.blocks,
      isPublic: project.isPublic,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      userId: project.userId,
    };
  }

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

  async getProjectData2(projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });
  }

  async createProject(createProjectDto: CreateProjectDto, userId: number) {
    const project = await this.prisma.project.create({
      data: {
        createdBy: userId,
        users: {
          connect: [{ id: userId }],
        },
        ProjectUser: {
          create: {
            userId,
            assignedBy: "system",
            assignedAt: new Date(),
          },
        },
      },
    });

    await this.prisma.userResult.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId: project.id,
        },
      },
      update: {
        data: createProjectDto.blocks,
      },
      create: {
        userId,
        projectId: project.id,
        data: createProjectDto.blocks,
      },
    });

    return project;
  }

  async shareProject(shareProjectDto: ShareProjectDto, userId: number) {
    const { userId: userToShareId, projectId } = shareProjectDto;

    const anyResult = await this.prisma.userResult.findFirst({
      where: {
        projectId: +projectId,
      },
    });

    const existingRelation = await this.prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: +userToShareId,
          projectId: +projectId,
        },
      },
    });

    if (existingRelation) {
      throw new ConflictException("Project already shared with this user");
    }

    await this.prisma.projectUser.create({
      data: {
        userId: +userToShareId,
        projectId: +projectId,
        assignedBy: userId.toString(),
        assignedAt: new Date(),
      },
    });

    return this.prisma.userResult.upsert({
      where: {
        userId_projectId: {
          userId: +userToShareId,
          projectId: +projectId,
        },
      },
      update: {
        data: anyResult?.data || {},
      },
      create: {
        userId: +userToShareId,
        projectId: +projectId,
        data: anyResult?.data || {},
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

  async publishProject(userId: number, projectId: number) {
    return this.prisma.project.update({
      where: {
        id: projectId,
        createdBy: userId,
      },
      data: {
        isPublic: true,
      },
    });
  }

  async saveTestResults(userId: number, projectId: number, resultsData: any) {
    const result = await this.prisma.userResult.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      update: {
        data: resultsData,
      },
      create: {
        userId,
        projectId,
        data: resultsData,
      },
    });

    return { data: result.data };
  }

  async getTestResults(userId: number, projectId: number) {
    const result = await this.prisma.userResult.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    const project = await this.prisma.project.findUnique({
      where: {
        id: +projectId,
      },
    });

    return {
      data: {
        blocks: result?.data || null,
      },
      updatedAt: result?.updatedAt || null,
      userId: result?.userId || null,
      isPublic: project?.isPublic || null,
    };
  }
}

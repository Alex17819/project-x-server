import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project-dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  async getProjectData(userId: number, projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
  }

  async createProject(createProjectDto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        blocks: createProjectDto.blocks,
        userId: userId,
      },
    });
  }

  async updateProject(
    createProjectDto: CreateProjectDto,
    userId: number,
    projectId: number,
  ) {
    return this.prisma.project.update({
      where: {
        id: projectId,
        userId,
      },
      data: {
        blocks: createProjectDto.blocks,
      },
    });
  }
}

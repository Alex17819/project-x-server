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

  async createProject(createProjectDto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        blocks: createProjectDto.blocks,
        userId: userId,
      },
    });
  }
}

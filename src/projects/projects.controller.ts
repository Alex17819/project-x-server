import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { CreateProjectDto } from "./dto/create-project-dto";
import { Request } from "express";
import { Roles } from "../auth/roles/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "../auth/roles/roles.guard";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ShareProjectDto } from "./dto/share-project.dto";
import { UserService } from "../user/user.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProjects(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.projectsService.getProjects(user?.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getProjectData(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    console.log("GET DATA");
    const user = req.user as { userId: number };
    return this.projectsService.getProjectData2(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return await this.projectsService.createProject(
      createProjectDto,
      user?.userId,
    );
  }

  @Post("/share")
  @UseGuards(JwtAuthGuard)
  async shareProject(
    @Body() shareProjectDto: ShareProjectDto,
    @Req() req: Request,
  ) {
    console.log(shareProjectDto);
    const user = req.user as { userId: number };
    return await this.projectsService.shareProject(
      shareProjectDto,
      user?.userId,
    );
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const user = req.user as { userId: number };
    return await this.projectsService.updateProject(
      updateProjectDto,
      user?.userId,
      id,
    );
  }

  @Put("/publish/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  async publishProject(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const user = req.user as { userId: number };
    return await this.projectsService.publishProject(user?.userId, id);
  }
}

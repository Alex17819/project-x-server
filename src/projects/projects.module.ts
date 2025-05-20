import { Module } from "@nestjs/common";

import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserService } from "../user/user.service";

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, UserService],
  imports: [PrismaModule],
})
export class ProjectsModule {}
